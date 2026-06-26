from django.db import IntegrityError
from django.db.models import Exists, OuterRef, Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Category, FeatureRequest, FeatureVote
from .permissions import IsOwnerOrReadOnly
from .serializers import CategorySerializer, FeatureRequestSerializer

_ALLOWED_ORDERINGS = {
    "vote_count": "vote_count",
    "-vote_count": "-vote_count",
    "created_at": "created_at",
    "-created_at": "-created_at",
}


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None


class FeatureRequestPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class FeatureRequestViewSet(viewsets.ModelViewSet):
    serializer_class = FeatureRequestSerializer
    pagination_class = FeatureRequestPagination
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        qs = FeatureRequest.objects.select_related("author")

        if self.request.user.is_authenticated:
            qs = qs.annotate(
                has_voted=Exists(
                    FeatureVote.objects.filter(
                        feature_request=OuterRef("pk"),
                        voter=self.request.user,
                    )
                )
            )

        author = self.request.query_params.get("author")
        if author:
            try:
                qs = qs.filter(author_id=int(author))
            except (ValueError, TypeError):
                qs = qs.none()

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(description__icontains=search))

        ordering = self.request.query_params.get("ordering", "-vote_count")
        qs = qs.order_by(_ALLOWED_ORDERINGS.get(ordering, "-vote_count"), "-created_at")

        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(
        detail=True,
        methods=["post", "delete"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def vote(self, request, pk=None):
        feature_request = self.get_object()

        if request.method == "POST":
            try:
                FeatureVote.objects.create(
                    feature_request=feature_request,
                    voter=request.user,
                )
            except IntegrityError:
                return Response(
                    {"detail": "Already voted."},
                    status=status.HTTP_409_CONFLICT,
                )
            return Response(status=status.HTTP_204_NO_CONTENT)

        deleted, _ = FeatureVote.objects.filter(
            feature_request=feature_request,
            voter=request.user,
        ).delete()

        if not deleted:
            return Response(
                {"detail": "Vote not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

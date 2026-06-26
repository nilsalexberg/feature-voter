from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, FeatureRequest

User = get_user_model()


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class FeatureRequestSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
    )
    has_voted = serializers.SerializerMethodField()

    class Meta:
        model = FeatureRequest
        fields = [
            "id",
            "title",
            "description",
            "author",
            "category",
            "category_id",
            "vote_count",
            "has_voted",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["vote_count", "created_at", "updated_at"]

    def get_has_voted(self, obj) -> bool:
        # Populated via DB annotation in get_queryset; False for anonymous users.
        return getattr(obj, "has_voted", False)

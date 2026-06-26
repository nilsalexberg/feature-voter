from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, FeatureRequest, FeatureVote

User = get_user_model()

LIST_URL = reverse("featurerequest-list")
CATEGORY_LIST_URL = reverse("category-list")


def detail_url(pk):
    return reverse("featurerequest-detail", args=[pk])


def vote_url(pk):
    return reverse("featurerequest-vote", args=[pk])


def category_detail_url(pk):
    return reverse("category-detail", args=[pk])


class VotingAPISetup(APITestCase):
    def setUp(self):
        self.alice = User.objects.create_user(username="alice", password="pass")
        self.bob = User.objects.create_user(username="bob", password="pass")
        self.category, _ = Category.objects.get_or_create(name="General")
        self.fr = FeatureRequest.objects.create(
            title="Dark mode",
            description="Add dark mode.",
            author=self.alice,
            category=self.category,
        )

    def auth(self, user):
        self.client.force_authenticate(user=user)

    def unauth(self):
        self.client.force_authenticate(user=None)


# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------

class CategoryAuthTests(VotingAPISetup):
    def test_list_requires_auth(self):
        self.unauth()
        self.assertEqual(self.client.get(CATEGORY_LIST_URL).status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_requires_auth(self):
        self.unauth()
        self.assertEqual(self.client.get(category_detail_url(self.category.pk)).status_code, status.HTTP_401_UNAUTHORIZED)


class CategoryListTests(VotingAPISetup):
    def setUp(self):
        super().setUp()
        self.auth(self.alice)

    def test_list_200(self):
        res = self.client.get(CATEGORY_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_list_is_not_paginated(self):
        res = self.client.get(CATEGORY_LIST_URL)
        self.assertIsInstance(res.data, list)

    def test_list_returns_all_categories(self):
        Category.objects.create(name="Performance")
        res = self.client.get(CATEGORY_LIST_URL)
        self.assertEqual(len(res.data), 2)

    def test_list_response_shape(self):
        res = self.client.get(CATEGORY_LIST_URL)
        self.assertIn("id", res.data[0])
        self.assertIn("name", res.data[0])

    def test_list_ordered_by_name(self):
        Category.objects.create(name="Accessibility")
        res = self.client.get(CATEGORY_LIST_URL)
        names = [c["name"] for c in res.data]
        self.assertEqual(names, sorted(names))


class CategoryRetrieveTests(VotingAPISetup):
    def setUp(self):
        super().setUp()
        self.auth(self.alice)

    def test_retrieve_200(self):
        res = self.client.get(category_detail_url(self.category.pk))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["id"], self.category.pk)
        self.assertEqual(res.data["name"], "General")

    def test_retrieve_404(self):
        res = self.client.get(category_detail_url(9999))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)


class CategoryReadOnlyTests(VotingAPISetup):
    def setUp(self):
        super().setUp()
        self.auth(self.alice)

    def test_create_not_allowed(self):
        res = self.client.post(CATEGORY_LIST_URL, {"name": "New"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_not_allowed(self):
        res = self.client.patch(category_detail_url(self.category.pk), {"name": "Changed"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_not_allowed(self):
        res = self.client.delete(category_detail_url(self.category.pk))
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


# ---------------------------------------------------------------------------
# Auth gate
# ---------------------------------------------------------------------------

class AuthRequiredTests(VotingAPISetup):
    def test_list_requires_auth(self):
        self.unauth()
        self.assertEqual(self.client.get(LIST_URL).status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_requires_auth(self):
        self.unauth()
        self.assertEqual(self.client.get(detail_url(self.fr.pk)).status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_requires_auth(self):
        self.unauth()
        res = self.client.post(LIST_URL, {"title": "X", "description": "Y", "category_id": self.category.pk}, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patch_requires_auth(self):
        self.unauth()
        res = self.client.patch(detail_url(self.fr.pk), {"title": "New"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_requires_auth(self):
        self.unauth()
        self.assertEqual(self.client.delete(detail_url(self.fr.pk)).status_code, status.HTTP_401_UNAUTHORIZED)

    def test_vote_requires_auth(self):
        self.unauth()
        self.assertEqual(self.client.post(vote_url(self.fr.pk)).status_code, status.HTTP_401_UNAUTHORIZED)


# ---------------------------------------------------------------------------
# List
# ---------------------------------------------------------------------------

class ListTests(VotingAPISetup):
    def setUp(self):
        super().setUp()
        self.auth(self.alice)

    def test_list_200(self):
        res = self.client.get(LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["count"], 1)

    def test_list_has_voted_false_when_not_voted(self):
        res = self.client.get(LIST_URL)
        self.assertFalse(res.data["results"][0]["has_voted"])

    def test_list_has_voted_true_after_vote(self):
        FeatureVote.objects.create(feature_request=self.fr, voter=self.alice)
        res = self.client.get(LIST_URL)
        self.assertTrue(res.data["results"][0]["has_voted"])

    def test_list_pagination(self):
        for i in range(5):
            FeatureRequest.objects.create(title=f"FR {i}", description="d", author=self.alice, category=self.category)
        res = self.client.get(LIST_URL, {"page_size": 3})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data["results"]), 3)
        self.assertIsNotNone(res.data["next"])

    def test_list_filter_by_author(self):
        FeatureRequest.objects.create(title="Bob FR", description="d", author=self.bob, category=self.category)
        res = self.client.get(LIST_URL, {"author": self.bob.pk})
        self.assertEqual(res.data["count"], 1)
        self.assertEqual(res.data["results"][0]["title"], "Bob FR")

    def test_list_filter_by_invalid_author_returns_empty(self):
        res = self.client.get(LIST_URL, {"author": "notanint"})
        self.assertEqual(res.data["count"], 0)

    def test_list_search_title(self):
        FeatureRequest.objects.create(title="Unrelated", description="nothing", author=self.bob, category=self.category)
        res = self.client.get(LIST_URL, {"search": "dark"})
        self.assertEqual(res.data["count"], 1)
        self.assertEqual(res.data["results"][0]["title"], "Dark mode")

    def test_list_search_description(self):
        res = self.client.get(LIST_URL, {"search": "Add dark"})
        self.assertEqual(res.data["count"], 1)

    def test_list_ordering_vote_count(self):
        fr2 = FeatureRequest.objects.create(title="Popular", description="d", author=self.bob, category=self.category)
        FeatureVote.objects.create(feature_request=fr2, voter=self.alice)
        fr2.vote_count = 1
        fr2.save()
        res = self.client.get(LIST_URL, {"ordering": "-vote_count"})
        self.assertEqual(res.data["results"][0]["title"], "Popular")

    def test_list_ordering_created_at(self):
        FeatureRequest.objects.create(title="Newer", description="d", author=self.bob, category=self.category)
        res = self.client.get(LIST_URL, {"ordering": "-created_at"})
        self.assertEqual(res.data["results"][0]["title"], "Newer")

    def test_list_ordering_invalid_falls_back_to_vote_count(self):
        res = self.client.get(LIST_URL, {"ordering": "injected_field"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_list_result_includes_category(self):
        res = self.client.get(LIST_URL)
        item = res.data["results"][0]
        self.assertIn("category", item)
        self.assertEqual(item["category"]["id"], self.category.pk)
        self.assertEqual(item["category"]["name"], "General")

    def test_list_result_excludes_category_id(self):
        res = self.client.get(LIST_URL)
        self.assertNotIn("category_id", res.data["results"][0])


# ---------------------------------------------------------------------------
# Retrieve
# ---------------------------------------------------------------------------

class RetrieveTests(VotingAPISetup):
    def setUp(self):
        super().setUp()
        self.auth(self.alice)

    def test_retrieve_200(self):
        res = self.client.get(detail_url(self.fr.pk))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["id"], self.fr.pk)

    def test_retrieve_404(self):
        res = self.client.get(detail_url(9999))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_fields(self):
        res = self.client.get(detail_url(self.fr.pk))
        for field in ("id", "title", "description", "author", "category", "vote_count", "has_voted", "created_at", "updated_at"):
            self.assertIn(field, res.data)

    def test_retrieve_author_shape(self):
        res = self.client.get(detail_url(self.fr.pk))
        self.assertIn("id", res.data["author"])
        self.assertIn("username", res.data["author"])

    def test_retrieve_category_shape(self):
        res = self.client.get(detail_url(self.fr.pk))
        self.assertIn("id", res.data["category"])
        self.assertIn("name", res.data["category"])


# ---------------------------------------------------------------------------
# Create
# ---------------------------------------------------------------------------

class CreateTests(VotingAPISetup):
    def setUp(self):
        super().setUp()
        self.auth(self.alice)

    def _payload(self, **overrides):
        base = {"title": "New FR", "description": "Desc", "category_id": self.category.pk}
        base.update(overrides)
        return base

    def test_create_201(self):
        res = self.client.post(LIST_URL, self._payload(), format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["author"]["username"], "alice")

    def test_create_sets_author_to_current_user(self):
        self.auth(self.bob)
        res = self.client.post(LIST_URL, self._payload(title="Bob FR"), format="json")
        self.assertEqual(res.data["author"]["username"], "bob")

    def test_create_response_includes_nested_category(self):
        res = self.client.post(LIST_URL, self._payload(), format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["category"]["id"], self.category.pk)
        self.assertEqual(res.data["category"]["name"], "General")

    def test_create_with_different_category(self):
        other = Category.objects.create(name="Performance")
        res = self.client.post(LIST_URL, self._payload(category_id=other.pk), format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["category"]["name"], "Performance")

    def test_create_missing_category_id_400(self):
        payload = {"title": "No category", "description": "Desc"}
        res = self.client.post(LIST_URL, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("category_id", res.data)

    def test_create_invalid_category_id_400(self):
        res = self.client.post(LIST_URL, self._payload(category_id=9999), format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_missing_title_400(self):
        res = self.client.post(LIST_URL, self._payload(title=""), format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", res.data)

    def test_create_missing_description_400(self):
        payload = {"title": "No desc", "category_id": self.category.pk}
        res = self.client.post(LIST_URL, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("description", res.data)

    def test_put_not_allowed(self):
        res = self.client.put(detail_url(self.fr.pk), self._payload(), format="json")
        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


# ---------------------------------------------------------------------------
# Update (PATCH)
# ---------------------------------------------------------------------------

class UpdateTests(VotingAPISetup):
    def setUp(self):
        super().setUp()
        self.auth(self.alice)

    def test_patch_owner_200(self):
        res = self.client.patch(detail_url(self.fr.pk), {"title": "Updated"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["title"], "Updated")

    def test_patch_non_owner_403(self):
        self.auth(self.bob)
        res = self.client.patch(detail_url(self.fr.pk), {"title": "Hack"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_partial_leaves_other_fields(self):
        res = self.client.patch(detail_url(self.fr.pk), {"title": "Only title"}, format="json")
        self.assertEqual(res.data["description"], self.fr.description)

    def test_patch_vote_count_is_read_only(self):
        res = self.client.patch(detail_url(self.fr.pk), {"vote_count": 999}, format="json")
        self.fr.refresh_from_db()
        self.assertEqual(self.fr.vote_count, 0)

    def test_patch_category_id(self):
        other = Category.objects.create(name="Performance")
        res = self.client.patch(detail_url(self.fr.pk), {"category_id": other.pk}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["category"]["name"], "Performance")
        self.fr.refresh_from_db()
        self.assertEqual(self.fr.category_id, other.pk)

    def test_patch_invalid_category_id_400(self):
        res = self.client.patch(detail_url(self.fr.pk), {"category_id": 9999}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


# ---------------------------------------------------------------------------
# Delete
# ---------------------------------------------------------------------------

class DeleteTests(VotingAPISetup):
    def setUp(self):
        super().setUp()
        self.auth(self.alice)

    def test_delete_owner_204(self):
        res = self.client.delete(detail_url(self.fr.pk))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(FeatureRequest.objects.filter(pk=self.fr.pk).exists())

    def test_delete_non_owner_403(self):
        self.auth(self.bob)
        res = self.client.delete(detail_url(self.fr.pk))
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(FeatureRequest.objects.filter(pk=self.fr.pk).exists())

    def test_delete_404(self):
        res = self.client.delete(detail_url(9999))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_category_with_existing_request_protected(self):
        from django.db.models import ProtectedError
        with self.assertRaises(ProtectedError):
            self.category.delete()


# ---------------------------------------------------------------------------
# Vote / Unvote
# ---------------------------------------------------------------------------

class VoteTests(VotingAPISetup):
    def setUp(self):
        super().setUp()
        self.auth(self.bob)

    def test_vote_204(self):
        res = self.client.post(vote_url(self.fr.pk))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(FeatureVote.objects.filter(feature_request=self.fr, voter=self.bob).exists())

    def test_vote_increments_vote_count(self):
        self.client.post(vote_url(self.fr.pk))
        self.fr.refresh_from_db()
        self.assertEqual(self.fr.vote_count, 1)

    def test_vote_duplicate_409(self):
        self.client.post(vote_url(self.fr.pk))
        res = self.client.post(vote_url(self.fr.pk))
        self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)

    def test_vote_on_own_request_allowed(self):
        self.auth(self.alice)
        res = self.client.post(vote_url(self.fr.pk))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_vote_404_on_missing_fr(self):
        res = self.client.post(vote_url(9999))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_unvote_204(self):
        FeatureVote.objects.create(feature_request=self.fr, voter=self.bob)
        res = self.client.delete(vote_url(self.fr.pk))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(FeatureVote.objects.filter(feature_request=self.fr, voter=self.bob).exists())

    def test_unvote_decrements_vote_count(self):
        FeatureVote.objects.create(feature_request=self.fr, voter=self.bob)
        self.fr.vote_count = 1
        self.fr.save()
        self.client.delete(vote_url(self.fr.pk))
        self.fr.refresh_from_db()
        self.assertEqual(self.fr.vote_count, 0)

    def test_unvote_no_existing_vote_404(self):
        res = self.client.delete(vote_url(self.fr.pk))
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

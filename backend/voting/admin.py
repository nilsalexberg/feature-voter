from django.contrib import admin

from .models import Category, FeatureRequest, FeatureVote


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]


class FeatureVoteInline(admin.TabularInline):
    model = FeatureVote
    extra = 0
    readonly_fields = ["voter", "created_at"]
    can_delete = False


@admin.register(FeatureRequest)
class FeatureRequestAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "vote_count", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["title", "description", "author__username"]
    readonly_fields = ["vote_count", "created_at", "updated_at"]
    inlines = [FeatureVoteInline]

from django.db import models
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import FeatureVote


@receiver(post_save, sender=FeatureVote)
def increment_vote_count(sender, instance, created, **kwargs):
    if created:
        instance.feature_request.__class__.objects.filter(
            pk=instance.feature_request_id
        ).update(vote_count=models.F("vote_count") + 1)


@receiver(post_delete, sender=FeatureVote)
def decrement_vote_count(sender, instance, **kwargs):
    instance.feature_request.__class__.objects.filter(
        pk=instance.feature_request_id
    ).update(vote_count=models.F("vote_count") - 1)

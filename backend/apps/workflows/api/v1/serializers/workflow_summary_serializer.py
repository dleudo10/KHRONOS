from rest_framework import serializers
from ....models import WorkflowVersionStatus

class WorkflowSummarySerializer(serializers.Serializer):
    versions_count = serializers.SerializerMethodField()
    published_version = serializers.SerializerMethodField()
    total_nodes = serializers.SerializerMethodField()
    recent_activity = serializers.SerializerMethodField()

    def get_versions_count(self, obj):
        return len(obj.ordered_versions)

    def get_published_version(self, obj):
        published = self._get_published_version(obj)

        if published is None:
            return None

        return published.version_number

    def get_total_nodes(self, obj):
        published = self._get_published_version(obj)

        if published is None:
            return 0

        return len(published.ordered_nodes)

    def get_recent_activity(self, obj):
        activities = []

        for version in obj.ordered_versions:
            activities.append({
                "type": "version_created",
                "description": (
                    f"Versión {version.version_number} creada"
                ),
                "version_number": version.version_number,
                "created_at": version.created_at,
            })

            if version.published:
                activities.append({
                    "type": "version_published",
                    "description": (
                        f"Versión {version.version_number} publicada"
                    ),
                    "version_number": version.version_number,
                    "created_at": version.published,
                })

        activities.sort(
            key=lambda item: item["created_at"],
            reverse=True,
        )

        return activities[:3]

    @staticmethod
    def _get_published_version(obj):
        return next(
            (
                version
                for version in obj.ordered_versions
                if version.status == WorkflowVersionStatus.PUBLISHED
            ),
            None,
        )
from rest_framework import serializers
from ....models import WorkflowVersionStatus

class WorkflowSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    code = serializers.CharField()
    description = serializers.CharField(allow_null=True, allow_blank=True,)
    is_active = serializers.BooleanField()
    
    version_number = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    published = serializers.SerializerMethodField()
    
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def get_latest_version(self, obj):
        versions = getattr(obj, "ordered_versions", [])
        return versions[0] if versions else None
    
    def get_version_number(self, obj):
        version = self.get_latest_version(obj)
        return version.version_number if version else None

    def get_status(self, obj):
        version = self.get_latest_version(obj)
        return version.status if version else None

    def get_published(self, obj):
        version = self.get_latest_version(obj)
        return version.published if version else None
    
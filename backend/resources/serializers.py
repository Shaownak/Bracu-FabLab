"""Resources serializers."""
from rest_framework import serializers
from .models import ResourceCategory, Resource

class ResourceCategorySerializer(serializers.ModelSerializer):
    resource_count = serializers.SerializerMethodField()
    class Meta:
        model = ResourceCategory
        fields = ['id', 'name', 'slug', 'description', 'resource_count']
    def get_resource_count(self, obj):
        return obj.resources.count()

class ResourceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    file_size_display = serializers.CharField(read_only=True)
    class Meta:
        model = Resource
        fields = ['id', 'title', 'category', 'category_name', 'description', 'file', 'resource_type', 'file_size', 'file_size_display', 'download_count', 'created_at']

class ResourceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['title', 'category', 'description', 'file', 'resource_type']
    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        if validated_data.get('file'):
            validated_data['file_size'] = validated_data['file'].size
        return super().create(validated_data)

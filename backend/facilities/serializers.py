"""
Facilities serializers.
"""

from rest_framework import serializers
from .models import EquipmentCategory, Equipment, EquipmentImage


class EquipmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentImage
        fields = ['id', 'image', 'caption', 'is_primary', 'order']


class EquipmentCategorySerializer(serializers.ModelSerializer):
    equipment_count = serializers.SerializerMethodField()

    class Meta:
        model = EquipmentCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'order', 'equipment_count']

    def get_equipment_count(self, obj):
        return obj.equipment.count()


class EquipmentListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 'status',
            'location', 'is_featured', 'requires_training', 'primary_image', 'image', 'description'
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return EquipmentImageSerializer(primary).data
        first = obj.images.first()
        if first:
            return EquipmentImageSerializer(first).data
        return None


class EquipmentDetailSerializer(serializers.ModelSerializer):
    category = EquipmentCategorySerializer(read_only=True)
    images = EquipmentImageSerializer(many=True, read_only=True)

    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'slug', 'category', 'description', 'specifications',
            'status', 'image', 'user_manual', 'requires_training', 'required_certification',
            'hourly_rate', 'location', 'is_featured', 'images', 'created_at', 'updated_at'
        ]


class EquipmentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = [
            'name', 'slug', 'category', 'description', 'specifications',
            'status', 'image', 'user_manual', 'requires_training', 'required_certification',
            'hourly_rate', 'location', 'is_featured'
        ]

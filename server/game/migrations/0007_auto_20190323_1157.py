# Generated by Django 2.1.7 on 2019-03-23 11:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0006_load_skins'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='phone_number',
            field=models.CharField(max_length=20, null=True),
        ),
    ]

"""Tests for the domain DTOs."""

from src.domain.dto.certification import Certification
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia


def test_project_to_dict():
    """Test Project to_dict method."""
    project = Project(
        id=1,
        title="Test Project",
        description="Test Description",
        url="https://example.com",
        tags=["test", "project"],
        active=True,
    )
    
    result = project.to_response()
    

    assert result["title"] == "Test Project"
    assert result["description"] == "Test Description"
    assert result["url"] == "https://example.com"
    assert result["tags"] == ["test", "project"]



def test_experience_to_dict():
    """Test Experience to_dict method."""
    experience = Experience(
        position="Test Position",
        company="Test Company",
        location="Test location",
        website="www.google.com",
        logo="https://example.com/logo.jpg",
        description="Test Description",
        skills="Test Skills",
        duration="test duration"
    )
    
    result = experience.to_response()
    

    assert result["position"] == "Test Position"
    assert result["company"] == "Test Company"
    assert result["location"] == "Test location"
    assert result["website"] == "www.google.com"
    assert result["logo"] == "https://example.com/logo.jpg"
    assert result["description"] == "Test Description"
    assert result["skills"] == "Test Skills"
    assert result["duration"] == "test duration"


def test_formation_to_dict():
    """Test Formation to_dict method."""
    formation = Formation(
        id=1,
        institution="Test Institution",
        type="Test Type",
        course="Test Course",
        period="2018-2022",
        description="Test Description",
        logo="https://example.com/logo.jpg",
        active=True,
    )
    
    result = formation.to_response()

    assert result["institution"] == "Test Institution"
    assert result["type"] == "Test Type"
    assert result["course"] == "Test Course"
    assert result["period"] == "2018-2022"
    assert result["description"] == "Test Description"
    assert result["logo"] == "https://example.com/logo.jpg"


def test_certification_to_dict():
    """Test Certification to_dict method."""
    certification = Certification(
        id=1,
        name="Test Certification",
        institution="Test Institution",
        credential_url="https://example.com/cred",
        logo="https://example.com/logo.jpg",
        active=True,
    )
    
    result = certification.to_response()

    assert result["name"] == "Test Certification"
    assert result["institution"] == "Test Institution"
    assert result["credential_url"] == "https://example.com/cred"
    assert result["logo"] == "https://example.com/logo.jpg"


def test_social_media_to_dict():
    """Test SocialMedia to_dict method."""
    social_media = SocialMedia(
        id=1,
        label="Test Social",
        url="https://example.com/social",
        type="test-type",
        active=True,
    )
    
    result = social_media.to_response()

    assert result["label"] == "Test Social"
    assert result["url"] == "https://example.com/social"
    assert result["type"] == "test-type"

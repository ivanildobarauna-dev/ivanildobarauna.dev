from typing import Optional

from pydantic import BaseModel


class Experience(BaseModel):
    """Professional experience with position, company and duration."""

    position: str
    company: str
    location: str
    website: Optional[str] = None
    logo: Optional[str] = None
    description: str
    skills: str
    duration: str

    def to_dict(self):
        """Return a dictionary representation of this experience."""
        return {
            "position": self.position,
            "company": self.company,
            "location": self.location,
            "website": self.website,
            "logo": self.logo,
            "description": self.description,
            "skills": self.skills,
            "duration": self.duration,
        }

from typing import Optional
from pydantic import BaseModel


class Experience(BaseModel):
    position: str
    company: str
    location: str
    website: Optional[str] = None
    logo: Optional[str] = None
    description: str
    skills: str
    duration: str

    def to_dict(self):
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

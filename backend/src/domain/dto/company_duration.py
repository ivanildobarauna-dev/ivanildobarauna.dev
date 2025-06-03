from pydantic import BaseModel


class CompanyDuration(BaseModel):
    """Company name with the total duration worked there."""

    name: str
    duration: str

    def to_dict(self):
        """Return a dictionary representation of this company duration."""
        return {
            "name": self.name,
            "duration": self.duration,
        }

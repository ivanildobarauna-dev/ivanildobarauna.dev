from pydantic import BaseModel


class CompanyDuration(BaseModel):
    name: str
    duration: str

    def to_response(self):
        return {
            "name": self.name,
            "duration": self.duration
        }
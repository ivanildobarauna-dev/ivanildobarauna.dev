import json
from datetime import datetime

from dateutil.relativedelta import relativedelta

from src.domain.dto.education import Certification, Education, Formation
from src.domain.dto.experience import Experience
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.infrastructure.ports.repository_interface import RepositoryInterface


class FileStorageAdapter(RepositoryInterface):
    def __init__(self, folder_path: str) -> None:
        self.folder_path = folder_path

    def get_all_projects(self) -> list[Project]:
        with open(self.folder_path + "/projects.json", "r", encoding="utf-8") as file:
            json_content = json.load(file)

            projects = [Project(**project) for project in json_content]

        return projects

    def get_all_educations(self) -> Education:
        with open(self.folder_path + "/education.json", "r", encoding="utf-8") as file:
            json_content = json.load(file)

            certifications = [
                Certification(**certification)
                for certification in json_content["certifications"]
            ]
            formations = [
                Formation(**formation) for formation in json_content["formations"]
            ]

            education = Education(certifications=certifications, formations=formations)

        return education

    def get_all_experiences(self) -> list[Experience]:
        with open(
            self.folder_path + "/experiences.json", "r", encoding="utf-8"
        ) as file:
            json_content = json.load(file)

            # Agrupar experiências por empresa
            company_experiences = {}
            for experience in json_content:
                company = experience["company"]
                if company not in company_experiences:
                    company_experiences[company] = {
                        "start_dates": [],
                        "end_dates": [],
                        "current_job": False,
                    }

                company_experiences[company]["start_dates"].append(
                    datetime.strptime(experience["startDate"], "%Y-%m")
                )

                if experience.get("currentJob", False):
                    company_experiences[company]["current_job"] = True
                elif "endDate" in experience:
                    company_experiences[company]["end_dates"].append(
                        datetime.strptime(experience["endDate"], "%Y-%m")
                    )

            # Calcular duração total por empresa
            for experience in json_content:
                company = experience["company"]
                company_data = company_experiences[company]

                earliest_start = min(company_data["start_dates"])
                if company_data["current_job"]:
                    latest_end = None
                else:
                    latest_end = max(company_data["end_dates"])

                experience["duration"] = self._calculate_duration(
                    earliest_start.strftime("%Y-%m"),
                    latest_end.strftime("%Y-%m") if latest_end else None,
                )

                experience["period"] = self._parse_period(
                    experience["startDate"],
                    (
                        experience["endDate"]
                        if not experience.get("currentJob", False)
                        else None
                    ),
                )

            experiences = [Experience(**experience) for experience in json_content]

        return experiences

    def get_all_social_media(self) -> list[SocialMedia]:
        """Get social links"""
        with open(
            self.folder_path + "/social_media.json", "r", encoding="utf-8"
        ) as file:
            json_content = json.load(file)

        return [SocialMedia(**social_link) for social_link in json_content]

    def get_total_duration(self) -> str:
        """Calculate the total duration in years from the first experience."""
        with open(
            self.folder_path + "/experiences.json", "r", encoding="utf-8"
        ) as file:
            json_content = json.load(file)

            first_experience_date = min(
                datetime.strptime(experience["startDate"], "%Y-%m")
                for experience in json_content
            )

            years_diff = relativedelta(datetime.now(), first_experience_date).years
            return f"{years_diff} {'ano' if years_diff == 1 else 'anos'}"

    def _calculate_duration(self, start_date: str, end_date: str = None) -> str:
        start = datetime.strptime(start_date, "%Y-%m")
        end = datetime.strptime(end_date, "%Y-%m") if end_date else datetime.now()

        diff = relativedelta(end, start)
        anos = diff.years
        meses = diff.months

        if anos == 0:
            return f"{meses} {'mês' if meses == 1 else 'meses'}"
        elif meses == 0:
            return f"{anos} {'ano' if anos == 1 else 'anos'}"
        else:
            return (
                f"{anos} {'ano' if anos == 1 else 'anos'} e "
                f"{meses} {'mês' if meses == 1 else 'meses'}"
            )

    def _parse_period(self, start_date: str, end_date: str = None) -> str:
        if end_date:
            return f"{start_date} - {end_date}"
        else:
            return f"{start_date} - Atualmente"

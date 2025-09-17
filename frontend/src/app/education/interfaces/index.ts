export interface Formation {
  id: string;
  course: string; // Nome do curso
  institution: string;
  period?: string; // Perodo formatado (ex: "2020 - 2024")
  type: string; // Tipo de formação (ex: "Bacharelado", "Tecnólogo")
  location?: string;
  description?: string;
  logo?: string;
  link?: string;
  current?: boolean;
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  issueDate?: string;
  credential_url: string; // URL do certificado
  description?: string;
  logo?: string;
}

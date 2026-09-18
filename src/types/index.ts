export interface Salary {
  currency: string;
  min: number;
  max: number;
}

export interface JobInfo {
  job_title: string;
  open_positions: number;
  destination_country: string;
  regional_hub: string;
  shift: string;
  salary: Salary;
  placement_tier: string;
}

export interface SkillReq {
  name: string;
  mandatory: boolean;
}

export interface LanguageReq {
  language: string;
  minimum_level: string;
}

export interface CandidateRequirements {
  minimum_experience_years: number;
  language_requirements: LanguageReq[];
  visa_sponsorship: boolean;
  work_authorization_required: boolean;
  visa_requirement: string;
  skills: SkillReq[];
}

export interface RoleDescription {
  overview: string;
  responsibilities: string[];
}

export interface JobRequirement {
  job_info: JobInfo;
  candidate_requirements: CandidateRequirements;
  role_description: RoleDescription;
}

export interface CriteriaResult {
  status: 'PASS' | 'FAIL' | 'REVIEW';
  required: any;
  actual: any;
  reason?: string;
}

export interface Gate1Criteria {
  experience: CriteriaResult;
  skills: CriteriaResult;
  language: CriteriaResult;
  visa: CriteriaResult;
}

export interface Gate1Result {
  candidate_name: string;
  filename: string;
  status: 'PASS' | 'FAIL' | 'REVIEW' | 'ERROR';
  criteria: Gate1Criteria;
  overall_reason: string;
  evidence_snippets: string[];
}

export interface ScreeningResponse {
  job_title: string;
  results: Gate1Result[];
}

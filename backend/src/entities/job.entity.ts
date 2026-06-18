export class Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  posted: string;
  logo: string;
}

export class Company {
  id: number;
  name: string;
}

export class Category {
  id: number;
  name: string;
  count: number;
  icon: string;
}

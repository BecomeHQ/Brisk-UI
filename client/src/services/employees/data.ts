
import { Employee, TeamMetrics } from "./types";
import { digitalDesignTeam } from "./teams/digitalDesign";
import { clientPartnerTeam } from "./teams/clientPartner";
import { contentTeam } from "./teams/content";
import { brandingTeam } from "./teams/branding";
import { frontrunnerTeam } from "./teams/frontrunner";
import { teamMetrics as metrics } from "./metrics";

export const employees: Employee[] = [
  ...digitalDesignTeam,
  ...clientPartnerTeam,
  ...contentTeam,
  ...brandingTeam,
  ...frontrunnerTeam,
];

export const teamMetrics: TeamMetrics = metrics;

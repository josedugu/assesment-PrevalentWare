import { UsersResolver } from "./users.js";
import { CountriesResolver } from "./countries.js"
import { UserMonitoringReslver } from "./userMonitoring.js";

export const resolvers = [UsersResolver, CountriesResolver, UserMonitoringReslver]
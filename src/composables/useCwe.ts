export interface CWE {
  id: number;
  info: string;
}

export const CWEList: Array<CWE> = [
  // Concurrency and Process Vulnerabilities
  { id: 362, info: "Race Condition" },
  { id: 412, info: "Unrestricted Externally Accessible Named Pipe" },
  { id: 567, info: "Unsynchronized Access to Shared Data" },
  { id: 568, info: "Race Condition within a Thread" },

  // Improper Message Handling
  { id: 116, info: "Improper Encoding or Escaping of Output" },
  { id: 180, info: "Incorrect Behavior Order: Validate Before Canonicalize" },
  {
    id: 117,
    info: "Improper Output Neutralization for Logs (Log Injection)",
  },
  { id: 345, info: "Insufficient Verification of Data Authenticity" },

  // Improper Input Validation / Injection
  { id: 20, info: "Improper Input Validation" },
  {
    id: 74,
    info: "Improper Neutralization of Special Elements in Output Used by a Downstream Component (Injection)",
  },
  { id: 78, info: "OS Command Injection" },
  { id: 94, info: "Code Injection" },
  { id: 95, info: "Eval Injection" },
  { id: 707, info: "Improper Neutralization" },

  // Security and Authentication Issues
  {
    id: 200,
    info: "Exposure of Sensitive Information to an Unauthorized Actor",
  },
  { id: 287, info: "Improper Authentication" },
  { id: 306, info: "Missing Authentication for Critical Function" },
  { id: 798, info: "Use of Hard-coded Credentials" },
  { id: 522, info: "Insufficiently Protected Credentials" },

  // Memory and Resource Mismanagement
  {
    id: 400,
    info: "Uncontrolled Resource Consumption (Resource Exhaustion)",
  },
  { id: 770, info: "Allocation of Resources Without Limits or Throttling" },
  { id: 401, info: "Memory Leak" },

  // Distributed System Flaws
  { id: 927, info: "Use of Implicit Intent for Sensitive Communication" },
  {
    id: 940,
    info: "Improper Verification of Source of a Communication Channel",
  },
  { id: 923, info: "Insecure Storage of Sensitive Information" },
  { id: 284, info: "Improper Access Control" },

  // Code Management and Eval
  {
    id: 829,
    info: "Inclusion of Functionality from Untrusted Control Sphere",
  },
  { id: 502, info: "Deserialization of Untrusted Data" },
];

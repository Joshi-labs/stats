export interface PrometheusValue {
  metric: { [key: string]: string };
  value: [number, string]; // [timestamp, value]
}

export interface PrometheusResponse {
  status: "success";
  data: {
    resultType: "vector" | "matrix";
    result: PrometheusValue[];
  };
}
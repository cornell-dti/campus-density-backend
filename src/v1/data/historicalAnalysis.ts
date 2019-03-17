type DayString = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
type HourString =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23';

export const analysis: {
  id: string;
  history: { [d in DayString]: { [h in HourString]?: number } };
}[] = [
  {
      "id": "libe",
      "history": 
      {
          "SUN": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.49,
          "11": 0.611,
          "12": 0.681,
          "13": 0.841,
          "14": 0.873,
          "15": 1,
          "16": 0.717,
          "17": 0.513,
          "18": 0.401,
          "19": 0.457,
          "20": 0.434,
          "21": 0.484,
          "22": 0.389,
          "23": 0.268
      },
      "MON": {
          "7": -1,
          "8": 0.443,
          "9": 0.621,
          "10": 0.709,
          "11": 0.876,
          "12": 0.727,
          "13": 0.826,
          "14": 1,
          "15": 0.95,
          "16": 0.936,
          "17": 0.543,
          "18": 0.624,
          "19": 0.663,
          "20": 0.642,
          "21": 0.858,
          "22": 0.589,
          "23": 0.535
      },
      "TUE": {
          "7": -1,
          "8": 0.41,
          "9": 0.571,
          "10": 0.679,
          "11": 0.894,
          "12": 0.734,
          "13": 0.91,
          "14": 0.862,
          "15": 0.917,
          "16": 1,
          "17": 0.58,
          "18": 0.702,
          "19": 0.635,
          "20": 0.609,
          "21": 0.606,
          "22": 0.503,
          "23": 0.41
      },
      "WED": {
          "7": -1,
          "8": 0.516,
          "9": 0.422,
          "10": 0.892,
          "11": 0.655,
          "12": 0.92,
          "13": 0.885,
          "14": 1,
          "15": 0.861,
          "16": 0.948,
          "17": 0.61,
          "18": 0.571,
          "19": 0.509,
          "20": 0.554,
          "21": 0.669,
          "22": 0.537,
          "23": 0.383
      },
      "THU": {
          "7": -1,
          "8": 0.484,
          "9": 0.709,
          "10": 0.717,
          "11": 1.102,
          "12": 0.791,
          "13": 0.882,
          "14": 0.984,
          "15": 1,
          "16": 0.988,
          "17": 0.665,
          "18": 0.543,
          "19": 0.587,
          "20": 0.5,
          "21": 0.488,
          "22": 0.386,
          "23": 0.307
      },
      "FRI": {
          "7": -1,
          "8": 0.365,
          "9": 0.578,
          "10": 0.877,
          "11": 0.749,
          "12": 0.972,
          "13": 0.791,
          "14": 1,
          "15": 0.739,
          "16": 0.81,
          "17": 0.445,
          "18": 0.232,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.571,
          "11": 0.472,
          "12": 0.714,
          "13": 0.974,
          "14": 0.892,
          "15": 1,
          "16": 0.81,
          "17": 0.641,
          "18": 0.500,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "cafejennie",
      "history":{
      "SUN": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": -1,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": -1,
          "8": 0.253,
          "9": 0.56,
          "10": 0.473,
          "11": 0.893,
          "12": 0.62,
          "13": 1,
          "14": 0.653,
          "15": 0.56,
          "16": 0.68,
          "17": 0.267,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": -1,
          "8": 0.253,
          "9": 0.56,
          "10": 0.473,
          "11": 0.893,
          "12": 0.62,
          "13": 1,
          "14": 0.653,
          "15": 0.56,
          "16": 0.68,
          "17": 0.267,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": -1,
          "8": 0.549,
          "9": 0.346,
          "10": 0.662,
          "11": 0.677,
          "12": 1,
          "13": 0.917,
          "14": 0.82,
          "15": 0.436,
          "16": 0.812,
          "17": 0.331,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": -1,
          "8": 0.243,
          "9": 0.5,
          "10": 0.507,
          "11": 0.784,
          "12": 0.534,
          "13": 1,
          "14": 0.682,
          "15": 0.459,
          "16": 0.635,
          "17": 0.291,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.68,
          "11": 0.656,
          "12": 1,
          "13": 0.91,
          "14": 0.877,
          "15": 0.82,
          "16": 0.689,
          "17": -1,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.552,
          "11": 0.552,
          "12": 1,
          "13": 0.952,
          "14": 0.781,
          "15": 0.895,
          "16": 0.638,
          "17": -1,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "okies",
      "history": {
      "SUN": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": -1,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 1,
          "12": 0.977,
          "13": 0.832,
          "14": 0.219,
          "15": -1,
          "16": 0.386,
          "17": 0.518,
          "18": 0.921,
          "19": 0.227,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 1,
          "12": 0.63,
          "13": 0.63,
          "14": 0.101,
          "15": -1,
          "16": 0.304,
          "17": 0.518,
          "18": 0.757,
          "19": 0.164,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.823,
          "12": 1,
          "13": 0.659,
          "14": 0.166,
          "15": -1,
          "16": 0.346,
          "17": 0.645,
          "18": 0.88,
          "19": 0.192,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 1,
          "12": 0.573,
          "13": 0.69,
          "14": 0.15,
          "15": -1,
          "16": 0.407,
          "17": 0.81,
          "18": 0.872,
          "19": 0.239,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.828,
          "12": 1,
          "13": 0.689,
          "14": 0.306,
          "15": -1,
          "16": -1,
          "17": -1,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": -1,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "becker",
      "history": {
      "SUN": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.646,
          "11": 0.873,
          "12": 0.642,
          "13": 0.792,
          "14": 0.024,
          "15": -1,
          "16": -1,
          "17": 1,
          "18": 0.92,
          "19": 0.528,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": 0.734,
          "12": 1,
          "13": 0.909,
          "14": 0.13,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.8,
          "12": 0.558,
          "13": 0.629,
          "14": 0.179,
          "15": -1,
          "16": -1,
          "17": 0.979,
          "18": 1,
          "19": 0.538,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.397,
          "12": 0.636,
          "13": 0.393,
          "14": 0.011,
          "15": -1,
          "16": -1,
          "17": 0.768,
          "18": 1,
          "19": 0.599,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.631,
          "12": 0.433,
          "13": 0.502,
          "14": 0.16,
          "15": -1,
          "16": -1,
          "17": 1,
          "18": 0.825,
          "19": 0.886,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": 0.162,
          "8": 0.554,
          "9": 0.378,
          "10": 0.378,
          "11": 0.518,
          "12": 0.716,
          "13": 0.604,
          "14": 0.176,
          "15": -1,
          "16": -1,
          "17": 0.459,
          "18": 1,
          "19": 0.532,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.283,
          "11": 0.409,
          "12": 0.424,
          "13": 0.533,
          "14": 0.011,
          "15": -1,
          "16": -1,
          "17": 0.899,
          "18": 1,
          "19": 0.62,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "west104",
      "history": {
      "SUN": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.873,
          "12": 0.642,
          "13": 0.792,
          "14": 0.024,
          "15": -1,
          "16": -1,
          "17": 1,
          "18": 0.92,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.734,
          "12": 1,
          "13": 0.909,
          "14": 0.13,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.8,
          "12": 0.558,
          "13": 0.629,
          "14": 0.179,
          "15": -1,
          "16": -1,
          "17": 0.979,
          "18": 1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.397,
          "12": 0.636,
          "13": 0.393,
          "14": 0.011,
          "15": -1,
          "16": -1,
          "17": 0.768,
          "18": 1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.631,
          "12": 0.433,
          "13": 0.502,
          "14": 0.16,
          "15": -1,
          "16": -1,
          "17": 1,
          "18": 0.825,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": 0.162,
          "8": 0.554,
          "9": 0.378,
          "10": 0.378,
          "11": 0.518,
          "12": 0.716,
          "13": 0.604,
          "14": 0.176,
          "15": 0.10,
          "16": -1,
          "17": -1,
          "18": 1,
          "19": 0.9,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.283,
          "11": 0.409,
          "12": 0.424,
          "13": 0.533,
          "14": 0.011,
          "15": -1,
          "16": -1,
          "17": 0.899,
          "18": 1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "bethe",
      "history": {
      "SUN": {
          "7": 0.241,
          "8": 0.431,
          "9": 0.356,
          "10": 0.218,
          "11": 0.417,
          "12": 0.583,
          "13": 0.541,
          "14": 0.006,
          "15": -1,
          "16": 0.28,
          "17": 0.529,
          "18": 1,
          "19": 0.272,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": 0.275,
          "8": 0.472,
          "9": 0.431,
          "10": 0.209,
          "11": 0.5,
          "12": 0.556,
          "13": 0.534,
          "14": 0.016,
          "15": -1,
          "16": 0.25,
          "17": 0.609,
          "18": 1,
          "19": 0.278,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": 0.373,
          "8": 0.703,
          "9": 0.656,
          "10": 0.383,
          "11": 0.981,
          "12": 0.679,
          "13": 0.689,
          "14": 0.01,
          "15": -1,
          "16": 0.321,
          "17": 0.732,
          "18": 1,
          "19": 0.278,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": 0.217,
          "8": 0.502,
          "9": 0.375,
          "10": 0.304,
          "11": 0.511,
          "12": 0.816,
          "13": 0.615,
          "14": 0,
          "15": -1,
          "16": 0,
          "17": 0.155,
          "18": 1,
          "19": 0.256,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": 0.251,
          "8": 0.547,
          "9": 0.494,
          "10": 0.358,
          "11": 0.844,
          "12": 0.543,
          "13": 0.634,
          "14": 0.004,
          "15": -1,
          "16": 0.337,
          "17": 0.802,
          "18": 1,
          "19": 0.453,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": 0.141,
          "8": 0.452,
          "9": 0.444,
          "10": 0.267,
          "11": 0.6,
          "12": 1,
          "13": 0.778,
          "14": 0.015,
          "15": -1,
          "16": 0.226,
          "17": 0.504,
          "18": 0.981,
          "19": 0.348,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.536,
          "11": 0.563,
          "12": 0.865,
          "13": 0.661,
          "14": 0.021,
          "15": -1,
          "16": 0.453,
          "17": 0.599,
          "18": 1,
          "19": 0.375,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "rpcc",
      "history": {
          "SUN": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.933,
          "11": 1,
          "12": 0.69,
          "13": 0.595,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.517,
          "18": 0.793,
          "19": 0.579,
          "20": 0.233,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.504,
          "18": 1,
          "19": 0.743,
          "20": 0.429,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.737,
          "18": 1,
          "19": 0.733,
          "20": 0.28,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.459,
          "18": 1,
          "19": 0.602,
          "20": 0.285,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.584,
          "18": 1,
          "19": 0.699,
          "20": 0.416,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.339,
          "18": 1,
          "19": 0.602,
          "20": 0.328,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.406,
          "18": 1,
          "19": 0.638,
          "20": 0.23,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "appel",
      "history": {
      "SUN": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.485,
          "11": 0.554,
          "12": 0.575,
          "13": 0.429,
          "14": 0.265,
          "15": 0.193,
          "16": -1,
          "17": 1,
          "18": 0.906,
          "19": 0.733,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": 0.354,
          "8": 0.556,
          "9": 0.531,
          "10": 0.347,
          "11": 0.603,
          "12": 0.621,
          "13": 0.533,
          "14": 0.28,
          "15": 0.079,
          "16": -1,
          "17": 0.81,
          "18": 1,
          "19": 0.686,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": 0.28,
          "8": 0.458,
          "9": 0.365,
          "10": 0.292,
          "11": 0.717,
          "12": 0.576,
          "13": 0.522,
          "14": 0.202,
          "15": 0.13,
          "16": -1,
          "17": 0.877,
          "18": 1,
          "19": 0.502,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": 0.193,
          "8": 0.471,
          "9": 0.309,
          "10": 0.275,
          "11": 0.435,
          "12": 0.667,
          "13": 0.39,
          "14": 0.184,
          "15": 0.085,
          "16": -1,
          "17": 0.691,
          "18": 1,
          "19": 0.401,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": 0.322,
          "8": 0.473,
          "9": 0.392,
          "10": 0.311,
          "11": 0.809,
          "12": 0.653,
          "13": 0.745,
          "14": 0.176,
          "15": 0.101,
          "16": -1,
          "17": 0.948,
          "18": 1,
          "19": 0.867,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": 0.143,
          "8": 0.362,
          "9": 0.401,
          "10": 0.424,
          "11": 0.539,
          "12": 0.973,
          "13": 0.583,
          "14": 0.329,
          "15": 0.136,
          "16": 0.06,
          "17": 0.545,
          "18": 1,
          "19": 0.564,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": 0.048,
          "8": 0.212,
          "9": 0.292,
          "10": 0.388,
          "11": 0.525,
          "12": 1,
          "13": 0.581,
          "14": 0.276,
          "15": 0.128,
          "16": 0.022,
          "17": 0.351,
          "18": 0.767,
          "19": 0.494,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "risley",
      "history": {
      "SUN": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": -1,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.77,
          "12": 0.745,
          "13": 0.506,
          "14": 0.333,
          "15": -1,
          "16": -1,
          "17": 0.749,
          "18": 1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 1,
          "12": 0.563,
          "13": 0.508,
          "14": 0.333,
          "15": -1,
          "16": -1,
          "17": 0.809,
          "18": 0.915,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.711,
          "12": 0.803,
          "13": 0.491,
          "14": 0.329,
          "15": -1,
          "16": -1,
          "17": 0.784,
          "18": 1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.969,
          "12": 0.591,
          "13": 0.508,
          "14": 0.389,
          "15": -1,
          "16": -1,
          "17": 1,
          "18": 0.601,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": 0.691,
          "12": 1,
          "13": 0.461,
          "14": 0.444,
          "15": -1,
          "16": -1,
          "17": 0.669,
          "18": 0.994,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": -1,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": -1,
          "18": -1,
          "19": -1,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "rose",
      "history": {
      "SUN": {
          "7": -1,
          "8": 0.238,
          "9": 0.389,
          "10": 0.120,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": 0.024,
          "15": -1,
          "16": -1,
          "17": 1,
          "18": 0.92,
          "19": 0.528,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": 0.192,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": 0.1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": 0.162,
          "8": 0.554,
          "9": 0.378,
          "10": 0.378,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": 0.179,
          "15": -1,
          "16": -1,
          "17": 0.979,
          "18": 1,
          "19": 0.538,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": 0.162,
          "8": 0.554,
          "9": 0.378,
          "10": 0.378,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": 0.011,
          "15": -1,
          "16": -1,
          "17": 0.768,
          "18": 1,
          "19": 0.599,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": 0.162,
          "8": 0.554,
          "9": 0.378,
          "10": 0.378,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": 0.16,
          "15": -1,
          "16": -1,
          "17": 1,
          "18": 0.825,
          "19": 0.886,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": 0.162,
          "8": 0.554,
          "9": 0.378,
          "10": 0.378,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": 0.176,
          "15": -1,
          "16": -1,
          "17": 0.459,
          "18": 1,
          "19": 0.532,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": 0.238,
          "9": 0.389,
          "10": 0.120,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": 0.024,
          "15": -1,
          "16": -1,
          "17": 1,
          "18": 0.92,
          "19": 0.528,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "cook",
      "history": {
          "SUN": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.646,
          "11": 0.873,
          "12": 0.642,
          "13": 0.792,
          "14": 0.024,
          "15": -1,
          "16": -1,
          "17": 1,
          "18": 0.92,
          "19": 0.528,
          "20": 0.528,
          "21": 0.400,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": 0.700,
          "21": 0.550,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": 0.700,
          "21": 0.550,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": 0.700,
          "21": 0.550,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": 0.700,
          "21": 0.550,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": 0.700,
          "21": 0.550,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.283,
          "11": 0.409,
          "12": 0.424,
          "13": 0.533,
          "14": 0.011,
          "15": -1,
          "16": -1,
          "17": 0.899,
          "18": 1,
          "19": 0.62,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
},
  {
      "id": "keeton",
      "history": { 
          "SUN": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.646,
          "11": 0.873,
          "12": 0.642,
          "13": 0.792,
          "14": 0.024,
          "15": -1,
          "16": -1,
          "17": 1,
          "18": 0.92,
          "19": 0.528,
          "20": 0.420,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "MON": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": 0.447,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "TUE": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": 0.447,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "WED": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": 0.447,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "THU": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": 0.447,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "FRI": {
          "7": -1,
          "8": 0.279,
          "9": 0.325,
          "10": 0.396,
          "11": -1,
          "12": -1,
          "13": -1,
          "14": -1,
          "15": -1,
          "16": -1,
          "17": 0.87,
          "18": 0.909,
          "19": 0.877,
          "20": 0.447,
          "21": -1,
          "22": -1,
          "23": -1
      },
      "SAT": {
          "7": -1,
          "8": -1,
          "9": -1,
          "10": 0.283,
          "11": 0.409,
          "12": 0.424,
          "13": 0.533,
          "14": 0.011,
          "15": -1,
          "16": -1,
          "17": 0.899,
          "18": 1,
          "19": 0.62,
          "20": -1,
          "21": -1,
          "22": -1,
          "23": -1
      }
  }
}
];


export default {
  "histories": [
    {
      "method": "get",
      "url": "coap://localhost:65084/6/0/1",
      "headerArray": [
        {
          "key": "Content-Format",
          "value": "application/json"
        },
        {
          "key": "Accept",
          "value": "text/plain"
        }
      ],
      "body": ""
    },
    {
      "method": "post",
      "url": "coap://localhost:65084/3303",
      "headerArray": [
        {
          "key": "Content-Format",
          "value": "application/vnd.oma.lwm2m+tlv"
        },
        {
          "key": "Accept",
          "value": "text/plain"
        }
      ],
      "body": "56"
    },
    {
      "method": "delete",
      "url": "coap://localhost:65084/3303/1",
      "headerArray": [
        {
          "key": "Content-Format",
          "value": "application/vnd.oma.lwm2m+tlv"
        },
        {
          "key": "Accept",
          "value": "text/plain"
        }
      ],
      "body": "56"
    },
    {
      "method": "put",
      "url": "coap://localhost:65084/3/0/15",
      "headerArray": [
        {
          "key": "Content-Format",
          "value": "text/plain"
        },
        {
          "key": "Accept",
          "value": "text/plain"
        }
      ],
      "body": ""
    }
  ],
  "devices": [
    {
      "name": "climate sensor",
      "active": false,
      "requests": [
        {
          "name": "get",
          "request": {
            "method": "get",
            "url": "coap://localhost:65084/6/0/1",
            "headerArray": [
              {
                "key": "Content-Format",
                "value": "application/json"
              },
              {
                "key": "Accept",
                "value": "text/plain"
              }
            ],
            "body": ""
          }
        },
        {
          "name": "put",
          "request": {
            "method": "put",
            "url": "coap://localhost:65084/3/0/15",
            "headerArray": [
              {
                "key": "Content-Format",
                "value": "text/plain"
              },
              {
                "key": "Accept",
                "value": "text/plain"
              }
            ],
            "body": ""
          }
        }
      ]
    },
    {
      "name": "refrigerator temp",
      "active": false,
      "requests": [
        {
          "name": "post",
          "request": {
            "method": "post",
            "url": "coap://localhost:65084/3303",
            "headerArray": [
              {
                "key": "Content-Format",
                "value": "application/vnd.oma.lwm2m+tlv"
              },
              {
                "key": "Accept",
                "value": "text/plain"
              }
            ],
            "body": "56"
          }
        },
        // {
        //   "name": "request2",
        //   "request": {
        //     "method": "put",
        //     "url": "coap://localhost:65084/3/0/15",
        //     "headerArray": [
        //       {
        //         "key": "Content-Format",
        //         "value": "text/plain"
        //       },
        //       {
        //         "key": "Accept",
        //         "value": "text/plain"
        //       }
        //     ],
        //     "body": ""
        //   }
        // }
      ]
    },
    {
      "name": "E-health monitor",
      "active": false,
      "requests": [
        {
          "name": "delete",
          "request": {
            "method": "delete",
            "url": "coap://localhost:65084/3303/2",
            "headerArray": [
              {
                "key": "Content-Format",
                "value": "application/vnd.oma.lwm2m+tlv"
              },
              {
                "key": "Accept",
                "value": "text/plain"
              }
            ],
            "body": "56"
          }
        }
      ]
    }
  ]
}
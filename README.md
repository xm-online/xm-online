# XM^online architecture

<img src="/assets/img/HLA-general.png" width="600">

* **Proxy** - a nginx server serves a Web application.
Repository: [xm-webapp](https://github.com/xm-online/xm-webapp)
* **S3 storage** - a storage for the public content like avatars and landing pages.
* **Gateway** - an application that handles all Web traffic to the microservices.
Repository: [xm-gate](https://github.com/xm-online/xm-gate)
* **UAA** - user authentication and authorization module.
Repository: [xm-uaa](https://github.com/xm-online/xm-uaa)
* **Registry** - a runtime application on which all applications registers and get their configuration from. 
It also provides runtime monitoring dashboards.
* **Microservices** - XM^online applications, that handle REST requests. 
They are stateless, and several instances of them can be launched in parallel to handle heavy loads.
  * **Dashboard** - manages all user’s interactive dashboards and widgets. 
Repository: [xm-ms-dashboard](https://github.com/xm-online/xm-ms-dashboard)
  * **Entity** - represents general business entities like, but not limited: Accounts, Resources, Agreements, Orders, Contacts, Products, Handlings etc. 
Repository: [xm-ms-entity](https://github.com/xm-online/xm-ms-entity)
  * **Timlene** - stores and presents all historical information. 
Repository: [xm-ms-timeline](https://github.com/xm-online/xm-ms-timeline)
  * **Balance** - provides a balance management with payment channels and financial operations. 
Repository: [xm-ms-timeline](https://github.com/xm-online/xm-ms-balance)
  * **Config** - stores and presents configuration in SVC for all XM^online modules and microservices.
Repository: [xm-ms-config](https://github.com/xm-online/xm-ms-config)

# XM^online features
## Multitenancy

## Multilogin

## Attribute Based Access Control

## Domain Objects

## Dashboards and Widgets

## Timelines

## Logic Extension Points

## Balances

## Real-time Campaign Management

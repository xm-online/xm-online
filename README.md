XM^online is an open-source framework that helps startups and developing businesses make digital transformation and launch a product with short time-to-market using MVP (Minimum Viable Product) approach. Due to real-time big data processing, multi-channel networks, enterprise integration, and secure multi-tenancy, it makes possible to launch new products and active high response engagement campaigns faster. 

The solution combines a set of customizable tools that allow customers to get own cloud application and configure it according to their needs and preferences.

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
  * **Timeline** - stores and presents all historical information. 
Repository: [xm-ms-timeline](https://github.com/xm-online/xm-ms-timeline)
  * **Balance** - provides a balance management with payment channels and financial operations. 
Repository: [xm-ms-timeline](https://github.com/xm-online/xm-ms-balance)
  * **Config** - stores and presents configuration in SVC for all XM^online modules and microservices.
Repository: [xm-ms-config](https://github.com/xm-online/xm-ms-config)

# XM^online features
## Anylogin

The default authentication flow requires users to pick their unique username and password when signing in. Some systems offer to enter email or phone number as a username instead. XM^online provides an alternative to both and allows customers to sign in using **multiple login identifiers**.

Anylogin functionality enables customers to sign in the system using a username or email address, or phone number (plus password, of course). Customers are free to insert **any of pre-configured login types** into login form’s username field.

By default XM^online offers three ways of authentication:
* Email and Password
* Phone number and Password
* Username and Password

<img src="/assets/img/XM2-feature-anylogin.png" width="400">

Besides users are able to sign in for XM^online using their **social network** credentials, such as Linkedin, Facebook, Google, Twitter.

Anylogin is an out-of-the-box authorization mechanism that is available to all customers by default. Once system user has specified his username, phone number, email at the system account settings he can use any of this information as login credentials.

## Multitenancy

Multitenancy is an architectural feature of XM^online allowing to provide a **dedicated space** (tenant) for each customer. A tenant serves to a group of users with specific privileges who share common access to their exclusive instance. It can be compared with a turn-key property rental in an apartment building, where a lodger does not have to be concerned about engineering the base, connecting to the facilities, accessing the entrance of the building and so on because he gets all public utility services with his flat.

The multitenant architecture allows customers to get a dedicated software with its data, configuration, individual functionality, user management and access rules. Such multitenant approach provides a possibility to various customers use XM^online common environment in own way, since each of them having a dedicated secure space. Each tenant is **isolated** and invisible to other tenants so customers do not have a feasibility to access each other's data. Information security is supported on the architectural level – the distinction between the tenants has been accomplished during the solution design.

<img src="/assets/img/XM2-feature-multitenancy.png" width="600">

The Multitenancy provides a high level of **customization** to satisfy company’s needs. XM^online supports customization of the user interface, business logic, workflow and access control. 

## Attribute Based Access Control

## Domain Objects

## Logic Extension Points

## Dashboards and Widgets

## Timelines



## Balances

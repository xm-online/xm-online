# XM^online 2

## Introduction
XM^online is an open-source framework that helps startups and developing businesses make digital transformation and launch a product with short time-to-market using MVP (Minimum Viable Product) approach. Due to real-time big data processing, multi-channel networks, enterprise integration, and secure multi-tenancy, it makes possible to launch new products and active high response engagement campaigns faster. 

The solution combines a set of customizable tools that allow customers to get own cloud application and configure it according to their needs and preferences.

* For a full description of the solution, visit the project page:
https://www.xm-online.com/

 * To submit bug reports and feature suggestions:
https://github.com/xm-online/xm-online/issues

## XM^online architecture

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

## XM^online features
### Anylogin

The default authentication flow requires users to pick their unique username and password when signing in. Some systems offer to enter email or phone number as a username instead. XM^online provides an alternative to both and allows customers to sign in using **multiple login identifiers**.

Anylogin functionality enables customers to sign in the system using a username or email address, or phone number (plus password, of course). Customers are free to insert **any of pre-configured login types** into login form’s username field.

By default XM^online offers three ways of authentication:
* Email and Password
* Phone number and Password
* Username and Password

<img src="/assets/img/XM2-feature-anylogin.png" width="400">

Besides users are able to sign in for XM^online using their **social network** credentials, such as Linkedin, Facebook, Google, Twitter.

Anylogin is an out-of-the-box authorization mechanism that is available to all customers by default. Once system user has specified his username, phone number, email at the system account settings he can use any of this information as login credentials.

### Multitenancy

Multitenancy is an architectural feature of XM^online allowing to provide a **dedicated space** (tenant) for each customer. A tenant serves to a group of users with specific privileges who share common access to their exclusive instance. It can be compared with a turn-key property rental in an apartment building, where a lodger does not have to be concerned about engineering the base, connecting to the facilities, accessing the entrance of the building and so on because he gets all public utility services with his flat.

The multitenant architecture allows customers to get a dedicated software with its data, configuration, individual functionality, user management and access rules. Such multitenant approach provides a possibility to various customers use XM^online common environment in own way, since each of them having a dedicated secure space. Each tenant is **isolated** and invisible to other tenants so customers do not have a feasibility to access each other's data. Information security is supported on the architectural level – the distinction between the tenants has been accomplished during the solution design.

<img src="/assets/img/XM2-feature-multitenancy.png" width="600">

The Multitenancy provides a high level of **customization** to satisfy company’s needs. XM^online supports customization of the user interface, business logic, workflow and access control. 

### Attribute Based Access Control

Attribute-based access control (abbreviated as **ABAC**) is an authorization model that provides dynamic, context-aware and risk-intelligent access control. ABAC evaluates available descriptive data (attributes) against stored policies to determine whether the user is authorized to access the requested resource. This authorization model helps XM^online users to configure larger and more definitive set of rules to express tenant access policies.

For example, with the help of access-control model it is possible to set the rules, like:
* *User A can access all entities of his company.*
* *User B can access all entities of his department.*
* *User C can access entities he created.*

In ABAC each separate action is evaluated against the attributes of entities (subject and object), operations, and the environmental conditions relevant to the request, while other access control paradigms consider each request in terms of isolated user role and the type of action that need to be performed.

<img src="/assets/img/XM2-feature-abac.png" width="400">

#### ABAC advantages
* Easy to understand and configure permissions mechanism.
* Effective control over the number of rules and conditions so it is easier to maintain.
* Access control permissions are evaluated in real-time when actual request is made.
* Ability to add attributes based on the existing infrastructures.

This approach has no restrictions: users can apply the rules of any complexity, including those that contain some unknown attributes. Due to the comparatively clear business logic and compact configuration ABAC makes it possible to avoid many of the costs associated with maintenance when implementing complex rules and provides absolute control over the actions and data inside the tenant, making it ideal for dynamic projects with rapidly changing requirements.

### Domain Objects
A domain object is a concept that represents an entity from a domain model related to the software and implements the business logic of its work. For example, the software solution for orders management can contain such domain objects as "order", "order item", "invoice". Domain objects encapsulate the information about the entity in the business domain, which is necessary for the software, that makes it understandable for non-technical people, such as business representatives. 

XM^online entities are created and configured dynamically within a tenant, where an administrator can specify and flexibly configure attributes, lifecycles and their relationships with other entities (domain objects) to cover customer’s problem area. This approach lets a customer avoid the hard-coding of all service functionalities and their possible compositions at design time, delaying their refinement until the execution phase.

If you’d like to learn more about XM^online domain objects read our article ‘[How to specify domain objects](https://github.com/xm-online/xm-online/wiki/How-to-specify-domain-objects)’.

### Logic Extension Points

### Dashboards and Widgets

### Timelines

### Balances

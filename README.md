# XM^online 2

## Introduction
XM^online is an open-source framework that helps startups and developing businesses make digital transformation and launch a product with short time-to-market using MVP (Minimum Viable Product) approach. Due to real-time big data processing, multi-channel networks, enterprise integration, and secure multi-tenancy, it makes possible to launch new products and active high response engagement campaigns faster. 

The solution combines a set of customizable tools that allow customers to get own cloud application and configure it according to their needs and preferences.

* For a full description of the solution, visit the project page:
https://www.xm-online.com/

 * To submit bug reports and feature suggestions:
https://github.com/xm-online/xm-online/issues

## Technologies

XM^online based on the JHipster generator. JHipster is a development platform to generate, develop and deploy Spring Boot + Angular Web applications and Spring microservices.

### Client Side
* **HTML 5** is a markup language used for structuring and presenting content on the World Wide Web. It is the fifth and current major version of the HTML standard.
* **CSS 3** is a style sheet language used for describing the presentation of a document written in a markup language like HTML.
* **Bootstrap 3** is a free and open-source front-end library for designing websites and web applications. It contains HTML- and CSS-based design templates for typography, forms, buttons, navigation and other interface components, as well as optional JavaScript extensions. 
* **Angular 5** is a TypeScript-based open-source front-end web application platform.
* **Angular JSON Schema Form** is a JSON Schema Form builder for Angular.

### Server Side
* **Spring Boot** is Spring's convention-over-configuration solution for creating stand-alone, production-grade Spring-based Applications that can "just run".
* **Spring Security** is a Java framework that provides authentication, authorization and other security features for enterprise applications.
* **Netflix OSS** cloud platform consists of Zuul (which integrates Hystrix, Eureka, and Ribbon as part of its IPC capabilities) provides dyamically scriptable proxying at the edge of the cloud deployment.
* **Consul** makes Service Discovery simple for services to register themselves and to discover other services via a DNS or HTTP interface. Register external services such as SaaS providers as well.
* **Gradle** is an open-source build automation system that introduces a Groovy-based domain-specific language (DSL) for declaring the project configuration.
* **Hibernate** is an object-relational mapping tool for the Java programming language. It provides a framework for mapping an object-oriented domain model to a relational database.
* **Liquibase** is an open source database-independent library for tracking, managing and applying database schema changes.
* **PostgreSQL** is an object-relational database management system (ORDBMS) with an emphasis on extensibility and standards compliance.
* **Cassandra** is a free and open-source distributed NoSQL database management system designed to handle large amounts of data across many commodity servers, providing high availability with no single point of failure.
* **ElasticSearch** is a search engine based on Lucene. It provides a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents.
* **Kafka** is an open-source stream-processing software platform.
* **Swagger** is an open source software framework backed by a large ecosystem of tools that helps developers design, build, document, and consume RESTful Web services.
* **Gatling** is an open-source load and performance testing framework based on Scala, Akka and Netty.

### Deployment
* **Docker** performs operating-system-level virtualization also known as containerization.

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

## XM^online installation using Docker

### System requirements

OS:  any which supports Docker (Linux is recommended)

RAM: 8 GB minimum (16 recommended)

CPU: 2 cores

STORAGE: 20 GB

Applications:
 - Docker v17.06+ (For installation follow its official documentation)
 - Git

### Installation steps

Сlone this project and set up a mirror of the source repository xm2-config for local configuration, make git clone --mirror project xm2-config
 ```sh
$ git clone https://github.com/xm-online/xm-online.git 
```
  - and set up a mirror of the source repository xm2-config for local configuration
  ```sh
cd xm-online/assets/ 
```
 
 ```sh
$ git clone --mirror https://github.com/xm-online/xm-ms-config-repository.git
```

From the `xm-online/assets/` run docker to start containers defined.
  - start swarm for work docker stack
 ```sh
$ docker swarm init
```
  - start service XM^online2

 ```sh
$ docker stack deploy -c docker-compose.yml xm2local
```
If it is the first time you are using those images, it will first download the images from hub which may take some time.

If nothing goes wrong you should see a couple of containers are running on your machine. To see them you can type: 

 ```sh
$ docker ps
$ docker service ls
```
In this example, we simply map port 80 of the host to port 80 of the Docker (or whatever port was exposed in the docker-compose.yml)
Verify the deployment by navigating to your server address in your preferred browser. 
 ```sh
 127.0.0.1:80 
 ```
or 
 ```sh
 <ip>:80 
 ```

*Note: some browsers for example Chrome prevents accessing to the url localhost:80 so we recommend to use direct IP*

The ports of all the services like Postgresql, Kafka etc. were intentionally changed to custom ones to not to conflict with the default ones that may be installed and running on machine. For example, to connect to Postgresql here is the credentials:
 ```sh
postgresql:
        image: postgres:9.6.2
        networks:
            - xm2
        ports:
            - 5432:5432
        volumes:
            - ./:/docker-entrypoint-initdb.d/
        environment:
            - POSTGRES_USER=postgres
            - POSTGRES_PASSWORD=postgres
        deploy:
            mode: replicated
            replicas: 1
            restart_policy:
                condition: on-failur
```
To get credentials of other services you may want to see docker-compose.yml and docker logs 

### Start/Stop and health check
To stop Docker swarm cluster you need to stop docker service with command:
```sh
$ service docker stop
```
Then start service again and run stack deploy for starting:

```sh
$ docker stack deploy -c docker-compose.yml xm2local
```

Also you can check active services in consul by url: `http://<IP>:8500` and ensure that next ervices are active (green):
 - balance
 - config
 - consul
 - dashboard
 - entity
 - gate
 - timeline
 - uaa

### Debugging
For debugging you can open logs service 
 ```sh
$ docker service logs {SERVICE_ID}
```
Sometimes you may need to bash into a specific container for debugging purposes. To do that:
 ```sh
$ docker exec -it {CONTAINER_ID} bash
```

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

<img src="/assets/img/XM2-feature-domain-objects.png" width="600">

If you’d like to learn more about XM^online domain objects read our article ‘[How to specify domain objects](https://github.com/xm-online/xm-online/wiki/How-to-specify-domain-objects)’.

### Balances
The Balance Management provides activities related to the creation and maintenance of the balances of a customer and/or a subscriber. Balances may be shared (e.g. between subscribers in a hierarchy).

Types of balances include:
* Monetary balances 
* Non-monetary balances (e.g. free unites, quota, tokens, etc.)

The balance management supports the definition of policies per balance or balance type. Policies include:
* Minimum Allowable Balance limit (e.g. balance must remain above zero).
* Balance expiration dates. 
* Balance thresholds actions and notifications.

Balance management operations include: 
* Unit reservation from a balance for a specified interval (session). Unused units are credited back into the balance when the session is released.
* Release of reserved unit 
* Balance prioritization based on policy/rules
* Balance inquiry. 
* Support for multiple simultaneous sessions that affect a common balance. 
* Splitting charges between multiple balances. 
* Application of a payment to a balance.

Communication of balance information to the financial systems (e.g. General Ledger, Accounts Receivable) within the enterprise.

<img src="/assets/img/XM2-feature-balance.png" width="300">

A balance (B) usually consists of a single value only. Its use is not directly restricted by specific periods of time. Instead it is only indirectly restricted through the rules the balance is used in.

For credit balances, however, it might be required that a balance consists of one or more values:
* with its own period of availability (which may then be further restricted by the rules the balance appears in) or
* marked with a label to identify a specific portion of a balance

Such a value with a certain validity period or a specific label is called a pocket (P). The validity start and end of a pocket can be configured based on
* date level, so that the validity of a pocket starts on day x at 00:00:00 and ends at day y at 00:00:00 or
* date and time level, so that the validity of a pocket also depends on the time of day, so when the pocket is created on day x at hh:mm:ss, the validity ends on day y at the same time on hh:mm:ss.

In the example, the value of the balance B3 is the sum of the values of all pockets P1, P2 and P3, which are valid at this point of time.

<img src="/assets/img/XM2-feature-balance-with-pockets.png" width="500">

### Logic Extension Points
LEP is a middle between the need for time-consuming full development and low-code/no-code platforms with pure visual tools. Many startups and enterprises focused on delivering applications for innovation, customer engagement, operational efficiency, or legacy migration are recognising the inherent business value and time-to-market advantages of using simple scripting coding (based on the Groovy).

XM^online with LEP functionality for application development that employ declarative techniques instead of programming are available to customers at low- or no-cost in money and training time to begin, with costs rising in proportion of the business value of the platforms.

<img src="/assets/img/XM2-feature-logic-extension-points.png" width="450">

There are several important drivers:

#### Operation-driven development
LEP offer more intuitive ways to build applications, minimising the use of coding. This approach enables a range of users - from professional developers to citizen developers.

#### Reusability
Productivity can be further accelerated with LEP that promote reusability through out-of-the-box templates, plug-ins, business components, and connectors to emerging technologies.

#### Support beyond the build phase
XM^online with LEP are designed to support the entire app lifecycle: design, build, deploy, manage and iterate.

#### Cloud-native deployment
XM^online offer the flexibility to deploy and manage applications in the cloud of your choice, or even on premises. Offering automated deployment along with a cloud-native, stateless architecture enables out-of-the-box high availability and fail over to support large-scale deployments, particularly in an enterprise context.

### Dashboards and Widgets

### Timelines


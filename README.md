# XM^ONLINE fast-code platform (XME.digital fast-code platform) 2

## Introduction

XME.digital (former XM^ONLINE) is based on an open-source framework XM^ONLINE. XM^ONLINE (XME.digital) fast-code platform helps startups, SME and corporations make digital transformation and launch of the digital products and services within a short period of time by using MVP (Minimum Viable Product) approach. Due to real-time big data processing, multi-channel networks, enterprise integration, and secure multi-tenancy, it makes it possible to launch new products and active high response engagement campaigns faster. 
The solution combines a set of customizable tools that allow customers to get own cloud application and configure it according to their needs and preferences.
For a full description of the solution, visit the project page: https://www.xme.digital/  
To submit bug reports and feature suggestions: https://github.com/xm-online/xm-online/issues

## Technologies

XM^online based on the JHipster generator. JHipster is a development platform to generate, develop and deploy Spring Boot + Angular Web applications and Spring microservices.

### Client Side

-   **HTML 5** is a markup language used for structuring and presenting content on the World Wide Web. It is the fifth and current major version of the HTML standard.
-   **CSS 3** is a style sheet language used for describing the presentation of a document written in a markup language like HTML.
-   **Bootstrap 4** is a free and open-source front-end library for designing websites and web applications. It contains HTML- and CSS-based design templates for typography, forms, buttons, navigation and other interface components, as well as optional JavaScript extensions.
-   **Angular 7** is a TypeScript-based open-source front-end web application platform.
-   **Angular JSON Schema Form** is a JSON Schema Form builder for Angular.

### Server Side

-   **Spring Boot** is Spring's convention-over-configuration solution for creating stand-alone, production-grade Spring-based Applications that can "just run".
-   **Spring Security** is a Java framework that provides authentication, authorization and other security features for enterprise applications.
-   **Netflix OSS** cloud platform consists of Zuul (which integrates Hystrix, Eureka, and Ribbon as part of its IPC capabilities) provides dyamically scriptable proxying at the edge of the cloud deployment.
-   **Consul** makes Service Discovery simple for services to register themselves and to discover other services via a DNS or HTTP interface. Register external services such as SaaS providers as well.
-   **Gradle** is an open-source build automation system that introduces a Groovy-based domain-specific language (DSL) for declaring the project configuration.
-   **Hibernate** is an object-relational mapping tool for the Java programming language. It provides a framework for mapping an object-oriented domain model to a relational database.
-   **Liquibase** is an open source database-independent library for tracking, managing and applying database schema changes.
-   **PostgreSQL** is an object-relational database management system (ORDBMS) with an emphasis on extensibility and standards compliance.
-   **Cassandra** is a free and open-source distributed NoSQL database management system designed to handle large amounts of data across many commodity servers, providing high availability with no single point of failure.
-   **ElasticSearch** is a search engine based on Lucene. It provides a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents.
-   **Kafka** is an open-source stream-processing software platform.
-   **Swagger** is an open source software framework backed by a large ecosystem of tools that helps developers design, build, document, and consume RESTful Web services.
-   **Gatling** is an open-source load and performance testing framework based on Scala, Akka and Netty.

### Deployment

-   **Docker** performs operating-system-level virtualization also known as containerization.

## XM^online architecture

<img src="/assets/img/HLA-general.png" width="600">

-   **Proxy** - a nginx server serves a Web application.
    Repository: [xm-webapp](https://github.com/xm-online/xm-webapp)
-   **S3 storage** - a storage for the public content like avatars and landing pages.
-   **Gateway** - an application that handles all Web traffic to the microservices.
    Repository: [xm-gate](https://github.com/xm-online/xm-gate)
-   **UAA** - user authentication and authorization module.
    Repository: [xm-uaa](https://github.com/xm-online/xm-uaa)
-   **Registry** - a runtime application on which all applications registers and get their configuration from.
    It also provides runtime monitoring dashboards.
-   **Microservices** - XM^online applications, that handle REST requests.
    They are stateless, and several instances of them can be launched in parallel to handle heavy loads.
    -   **Dashboard** - manages all user’s interactive dashboards and widgets.
        Repository: [xm-ms-dashboard](https://github.com/xm-online/xm-ms-dashboard)
    -   **Entity** - represents general business entities like, but not limited: Accounts, Resources, Agreements, Orders, Contacts, Products, Handlings etc.
        Repository: [xm-ms-entity](https://github.com/xm-online/xm-ms-entity)
    -   **Timeline** - stores and presents all historical information.
        Repository: [xm-ms-timeline](https://github.com/xm-online/xm-ms-timeline)
    -   **Balance** - provides a balance management with payment channels and financial operations.
        Repository: [xm-ms-timeline](https://github.com/xm-online/xm-ms-balance)
    -   **Config** - stores and presents configuration in SVC for all XM^online modules and microservices.
        Repository: [xm-ms-config](https://github.com/xm-online/xm-ms-config)

## XM^online installation using Docker

### System requirements

-   **OS** - any which supports Docker (Linux is recommended)
-   **RAM** - 8 Gb minimum (16 Gb recommended)
-   **CPU** - 2 cores minimum (6 cores recommended)
-   **Storage** - 20 Gb minimum

Applications:

-   Docker v17.06+ (For installation follow its official documentation)
-   Git

### Installation steps

-   set _net.core.somaxconn = 4096_ in _/etc/sysctl.conf_ and reload

```sh
sudo sysctl -p
```

Сlone this project and set up a mirror of the source repository xm2-config for local configuration, make git clone --mirror project xm2-config

```sh
$ git clone https://github.com/xm-online/xm-online.git
```

-   and set up a mirror of the source repository xm2-config for local configuration

```sh
cd xm-online/assets/
```

From the `xm-online/assets/` run docker to start containers defined.

-   start Docker
-   start swarm for work docker stack

```sh
docker swarm init
```

-   start each misc service for XM^online2

```sh
docker stack deploy -c misc-services/consul/docker-compose.yml xm2local
docker stack deploy -c misc-services/kafka/docker-compose.yml xm2local
docker stack deploy -c misc-services/elasticsearch/docker-compose.yml xm2local
docker stack deploy -c misc-services/postgres/docker-compose.yml xm2local
docker stack deploy -c misc-services/zookeeper/docker-compose.yml xm2local
```

-   change default _max connections_ to 300 in _/var/lib/docker/volumes/xm2local_pg-data/\_data/postgresql.conf_

```sh
max_connections = 300
```

-   restart postgres

```sh
docker rm -f $(docker ps | grep postgres | awk '{print $1}')
```

-   initialize postgres databases

```sh
docker exec -it $(docker ps | grep postgres | awk '{print $1}') psql -U postgres

CREATE DATABASE activation;
CREATE DATABASE balance;
CREATE DATABASE dashboard;
CREATE DATABASE document;
CREATE DATABASE entity;
CREATE DATABASE scheduler;
CREATE DATABASE uaa;
CREATE DATABASE timeline;
\q
```

-   initialize passwords for each XM^online2 service (_postgres_ is default)

```sh
echo postgres | docker secret create BALANCE_SPRING_DATASOURCE_PASSWORD -
echo postgres | docker secret create UAA_SPRING_DATASOURCE_PASSWORD -
echo postgres | docker secret create TIMELINE_SPRING_DATASOURCE_PASSWORD -
echo postgres | docker secret create ENTITY_SPRING_DATASOURCE_PASSWORD -
echo postgres | docker secret create DASHBOARD_SPRING_DATASOURCE_PASSWORD -
echo postgres | docker secret create SCHEDULER_SPRING_DATASOURCE_PASSWORD -
echo my$3cr3t | docker secret create APPLICATION_GIT_PASSWORD -

```

-   start each XM^online2 service

```sh
// Go to service directory
cd ../releases/docker-swarm/

source component-versions.env
docker stack deploy -c xm-gate/docker-compose.yml xm2local
docker stack deploy -c xm-ms-config/docker-compose.yml xm2local
git clone --mirror https://github.com/xm-online/xm-ms-config-repository.git /var/lib/docker/volumes/xm2local_config-repo/_data/
docker stack deploy -c xm-ms-entity/docker-compose.yml xm2local
docker stack deploy -c xm-uaa/docker-compose.yml xm2local
docker stack deploy -c xm-webapp/docker-compose.yml xm2local
docker stack deploy -c xm-ms-balance/docker-compose.yml xm2local
docker stack deploy -c xm-ms-timeline/docker-compose.yml xm2local
docker stack deploy -c xm-ms-scheduler/docker-compose.yml xm2local
docker stack deploy -c xm-ms-dashboard/docker-compose.yml xm2local
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

<img src="/assets/img/XM2-home-page.png" width="6800">
 
Default user `xm/P@ssw0rd` could be used to sign-in.

_Note: some browsers for example Chrome prevents accessing to the url localhost:80 so we recommend to use direct IP_

The ports of all the services like Postgresql, Kafka etc. were intentionally changed to custom ones to not to conflict with the default ones that may be installed and running on machine. For example, to connect to Postgresql here is the credentials (./assets/misc-services/postgres/password.txt):

```sh
version: '3.7'
services:
   postgres:
       image: postgres:9.6.2
       networks:
           - xm2
       ports:
           - 5432:5432
       volumes:
           - pg-data:/var/lib/postgresql/data
       environment:
               POSTGRES_USER: postgres
               POSTGRES_PASSWORD_FILE: POSTGRES_PASSWORD
secrets:
   POSTGRES_PASSWORD:
       file: ./password.txt
       name: POSTGRES_PASSWORD
```

To get credentials of other services you may want to see docker-compose.yml and docker logs

### Start/Stop and health check

To stop Docker swarm use command:

```sh
$ docker stack rm xm2local
```

To start:

```sh
$ docker stack deploy -c docker-compose.yml xm2local
```

Also you can check active services in consul by url: `http://<IP>:8500` and ensure that next ervices are active (green):

-   balance
-   config
-   consul
-   dashboard
-   entity
-   gate
-   timeline
-   uaa

### Debugging

In order to debug particular xm microservice:

Update docker file in microservice you want to debug:

```sh
{microservice-name}/src/main/docker/Dockerfile
```

Add to JAVA_OPTS variable (or simple pass this options after java -jar myservice.jar -Dagentlib:...):

```sh
-Dagentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8000
```

Add port to expose command (or use any other options from Docker to expose port for container):

```sh
EXPOSE 9999 8000
```

Update docker-compose.yml file and add/update microservice configuration you want to debug:

```sh
ports:
     - 8000:8000
```

(Intellij idea) Run Remote configuration
Open microservice you previously added debug to,
In Run/Debug Configuration click on "+" button and find "Remote" configuration,
Update "Port" field inside Remote configuration with value 8000,
Click Apply and Ok,
Run this Remote configuration from menu by click on the green "->" button.

For checking microservice logs you can run

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

-   Email and Password
-   Phone number and Password
-   Username and Password

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

-   _User A can access all entities of his company._
-   _User B can access all entities of his department._
-   _User C can access entities he created._

In ABAC each separate action is evaluated against the attributes of entities (subject and object), operations, and the environmental conditions relevant to the request, while other access control paradigms consider each request in terms of isolated user role and the type of action that need to be performed.

<img src="/assets/img/XM2-feature-abac.png" width="400">

#### ABAC advantages

-   Easy to understand and configure permissions mechanism.
-   Effective control over the number of rules and conditions so it is easier to maintain.
-   Access control permissions are evaluated in real-time when actual request is made.
-   Ability to add attributes based on the existing infrastructures.

This approach has no restrictions: users can apply the rules of any complexity, including those that contain some unknown attributes. Due to the comparatively clear business logic and compact configuration ABAC makes it possible to avoid many of the costs associated with maintenance when implementing complex rules and provides absolute control over the actions and data inside the tenant, making it ideal for dynamic projects with rapidly changing requirements.

### Domain Objects

A domain object is a concept that represents an entity from a domain model related to the software and implements the business logic of its work. For example, the software solution for orders management can contain such domain objects as "order", "order item", "invoice". Domain objects encapsulate the information about the entity in the business domain, which is necessary for the software, that makes it understandable for non-technical people, such as business representatives.

XM^online entities are created and configured dynamically within a tenant, where an administrator can specify and flexibly configure attributes, lifecycles and their relationships with other entities (domain objects) to cover customer’s problem area. This approach lets a customer avoid the hard-coding of all service functionalities and their possible compositions at design time, delaying their refinement until the execution phase.

<img src="/assets/img/XM2-feature-domain-objects.png" width="600">

If you’d like to learn more about XM^online domain objects read our article ‘[How to specify domain objects](https://github.com/xm-online/xm-online/wiki/How-to-specify-domain-objects)’.

### Balances

The Balance Management provides activities related to the creation and maintenance of the balances of a customer and/or a subscriber. Balances may be shared (e.g. between subscribers in a hierarchy).

Types of balances include:

-   Monetary balances
-   Non-monetary balances (e.g. free unites, quota, tokens, etc.)

The balance management supports the definition of policies per balance or balance type. Policies include:

-   Minimum Allowable Balance limit (e.g. balance must remain above zero).
-   Balance expiration dates.
-   Balance thresholds actions and notifications.

Balance management operations include:

-   Unit reservation from a balance for a specified interval (session). Unused units are credited back into the balance when the session is released.
-   Release of reserved unit
-   Balance prioritization based on policy/rules
-   Balance inquiry.
-   Support for multiple simultaneous sessions that affect a common balance.
-   Splitting charges between multiple balances.
-   Application of a payment to a balance.

Communication of balance information to the financial systems (e.g. General Ledger, Accounts Receivable) within the enterprise.

<img src="/assets/img/XM2-feature-balance.png" width="300">

A balance (B) usually consists of a single value only. Its use is not directly restricted by specific periods of time. Instead it is only indirectly restricted through the rules the balance is used in.

For credit balances, however, it might be required that a balance consists of one or more values:

-   with its own period of availability (which may then be further restricted by the rules the balance appears in) or
-   marked with a label to identify a specific portion of a balance

Such a value with a certain validity period or a specific label is called a pocket (P). The validity start and end of a pocket can be configured based on

-   date level, so that the validity of a pocket starts on day x at 00:00:00 and ends at day y at 00:00:00 or
-   date and time level, so that the validity of a pocket also depends on the time of day, so when the pocket is created on day x at hh:mm:ss, the validity ends on day y at the same time on hh:mm:ss.

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

A **dashboard** is a visual display of the most important information needed to achieve different objectives, arranged on a single screen, so the main information can be seen at first sight. In other terms, they are a collection of widgets that give an overview of the most important data.

XM^online, allows to create multiple dashboards, which, helps to navigate faster through the System and allows to configure dashboards, for different users. For example, simple user can have access to only certain dashboard, while other user, to the other one. Also, dashboard logic depends mainly on the business task.

A **widget** is a mini-report that can display your data in a number of different presentation styles, including simple graphics, charts, tables. On the specific dashboard, they can show information about bookings, revenue or completed tasks. Widgets, can be different. For example, _Stats Widget_ can give the information about number of active accounts and, in the same time, about number of cars. The thing is, that they can be the same type, but they give different information, from different applications, for different dashboards.

Widgets can contain not only plain static numbers, but also, they can perform different active functions. For example, _Tasks Widget_, where you have functionality such as adding tasks, changing reminders, creating events, editing and completing tasks is available straight from your home screen.

There are widgets that can not be configured, while others can be for specific client needs, like:

-   _Welcome Widget_
-   _Sign-in/Sign-up Widget_
-   _Entity Widget_
-   _Stats Widget_
-   _General map Widget_
-   _Weather Widget_
-   _Clock Widget_
-   _News Widget_
-   _Markdown Widget_
-   _Tasks Widget_
-   _Entities list Widget_

### Timelines

A **timeline** diagrams present events during specific intervals shown chronologically along a line. Timelines are used as a control and monitoring tools. They can highlight important events and required information in the current context to provide additional information on how the process can be optimized and therefore increased.

_As an example of timeline, it can be a history of the bank operations. It can include different operations (cash withdrawal, payments, receipts and other business transactions). The start point can be the first transaction of account, the last point will be the most recent transaction. It allows to see how money are moved through account and for what reason._

<img src="/assets/img/XM2-feature-timeline.png" width="300">

A timeline implemented in the XM^online is a presentation tool which is displayed most important events that occur in the System relating to the specified entity. Events in timelines are tied with each other and they can be aggregated. Besides timeline can be displayed for any element of the System whether it is timeline of entity or timeline of menu. Timeline in the XM^online allows the next things:

-   sorting by tags, for quicker search of problems, important information that happened in a certain time or the other things that can be useful for customers;
-   configuring to display only important changes with an entity;
-   configuring to display changes of some special functionality;
-   tuning displayed events such as:
    -   technical data of person who changed (browser, operating system);
    -   business data (transactions, fulfilling orders);
    -   logic data (what was changed and why);
-   configuring how to display events (ways of notes, ordering, icons).

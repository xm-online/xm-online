# XME.digital Core 

**Open-source fast-code platform for building SaaS products, B2B/B2C solutions, and rapid prototyping**
(formerly known as a XM^ONLINE) 

## About

XME.digital Core is the foundation of the XME.digital platform, available under the Apache-2.0 license. We believe we've built a powerful tool and want to share it with engineers and developers worldwide.

Use XME.digital Core to:
- Build your own SaaS products with complete independence
- Develop B2B and B2C solutions
- Rapidly prototype startup ideas with future scalability in mind

The Core includes all essential developer tools to implement and run your applications. Enterprise features are available separately through [XME.digital](https://xme.digital).

## Key Features

- **Multi-tenancy** — dedicated isolated spaces for each customer with individual configuration, user management, and access rules
- **Dynamic Domain Objects** — create and configure entities dynamically without hard-coding
- **Attribute-Based Access Control (ABAC)** — context-aware, risk-intelligent access control with flexible policy rules
- **Logic Extension Points (LEP)** — extend business logic using Groovy, JavaScript, or TypeScript without full development cycles
- **Dashboards & Widgets** — configurable visual displays with multiple widget types
- **Balance Management** — monetary and non-monetary balance operations with policies and thresholds
- **Timeline** — chronological event tracking and monitoring for any entity
- **Anylogin** — flexible authentication via username, email, phone, or social networks

## Architecture

XME.digital Core uses microservice architecture built on Spring Boot and Angular:

| Component | Description | Repository |
|-----------|-------------|------------|
| **Gateway** | Handles all web traffic to microservices | [xm-gate](https://github.com/xm-online/xm-gate) |
| **UAA** | User authentication and authorization | [xm-uaa](https://github.com/xm-online/xm-uaa) |
| **Entity** | Business entities management | [xm-ms-entity](https://github.com/xm-online/xm-ms-entity) |
| **Dashboard** | User dashboards and widgets | [xm-ms-dashboard](https://github.com/xm-online/xm-ms-dashboard) |
| **Timeline** | Historical information storage | [xm-ms-timeline](https://github.com/xm-online/xm-ms-timeline) |
| **Balance** | Balance and payment management | [xm-ms-balance](https://github.com/xm-online/xm-ms-balance) |
| **Config** | Configuration storage for all modules | [xm-ms-config](https://github.com/xm-online/xm-ms-config) |
| **Web App** | Frontend application | [xm-webapp](https://github.com/xm-online/xm-webapp) |

## Technology Stack

**Backend:** Java, Spring Boot, Spring Security, Hibernate, Kafka, PostgreSQL, Elasticsearch, Consul

**Frontend:** Angular, TypeScript, Bootstrap

**Infrastructure:** Docker, Kubernetes, Gradle

## System Requirements

- **OS:** Any supporting Docker (Linux recommended)
- **RAM:** 8 GB minimum (16 GB recommended)
- **CPU:** 2 cores minimum (6 cores recommended)
- **Storage:** 20 GB minimum

## Quick Start

```sh
git clone https://github.com/xm-online/xm-online.git
cd xm-online/assets/
docker swarm init
```

For detailed installation instructions, see the [Installation Guide](https://github.com/xm-online/xm-online/wiki/Installation).

## Documentation

- [Product Website](https://xme.digital)
- [Wiki](https://github.com/xm-online/xm-online/wiki)
- [How to specify domain objects](https://github.com/xm-online/xm-online/wiki/How-to-specify-domain-objects)

## Support & Services

Reach out for:
- Questions and community support
- Code contributions
- Consulting services
- Training

**Issues:** [GitHub Issues](https://github.com/xm-online/xm-online/issues)

**Contact:** [xme.digital](https://xme.digital)

## License

Apache-2.0

---

**Changes made:**
1. Updated positioning to reflect open-source Core vs Enterprise distinction
2. Simplified and modernized structure
3. Added clear value proposition at the top
4. Reorganized architecture as a table for readability
5. Condensed technology stack
6. Removed outdated step-by-step Docker commands (linked to wiki instead)
7. Added support section with contribution mention
8. Removed legacy XM^ONLINE naming throughout (kept only where historically relevant)

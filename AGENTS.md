# Agent Guidelines for Shopee Price History

## Build/Lint/Test Commands
- **Frontend**: `npm run dev` (dev), `npm run build` (build), `npm run start` (start), `npm run lint` (lint)
- **Backend**: `mvn clean compile` (compile), `mvn test` (test), `mvn spring-boot:run` (run), `mvn spring-boot:run -Dspring-boot.run.profiles=prod` (run-prod), `mvn clean install` (full build)
- **Single test**: `mvn test -Dtest=ClassName#testMethod` (Java), no frontend tests configured
- **Full app**: `docker-compose up` (runs all services with nginx, postgres)

## Code Style Guidelines
- **Java**: Spring Boot + Lombok + MapStruct. Use @AllArgsConstructor, @Service, @Transactional. Organize imports alphabetically. Use camelCase. Handle errors with RuntimeException.
- **TypeScript**: Next.js functional components with PascalCase. Use Tailwind CSS classes. Absolute imports with @/ prefix. No semicolons, single quotes.
- **Naming**: camelCase for variables/methods, PascalCase for classes/components, UPPER_CASE for constants
- **Error handling**: Java uses RuntimeException, TypeScript uses standard React error boundaries
- **Testing**: JUnit 5 for backend, no frontend testing framework configured
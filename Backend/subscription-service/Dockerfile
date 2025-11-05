FROM eclipse-temurin:17-jdk-alpine
 
WORKDIR /app
 
COPY target/subscription-service-0.0.1-SNAPSHOT.jar subscription-service-0.0.1-SNAPSHOT.jar
 
EXPOSE 8800
 
CMD ["java", "-jar", "subscription-service-0.0.1-SNAPSHOT.jar"]

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy the jar file into the container
COPY target/menu-service-0.0.1-SNAPSHOT.jar menu-service-0.0.1-SNAPSHOT.jar
# Make the port available to the outside world
EXPOSE 8920
# Run the jar file
CMD ["java", "-jar", "menu-service-0.0.1-SNAPSHOT.jar"] 

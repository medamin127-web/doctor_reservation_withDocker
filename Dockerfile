# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy maven files first for better caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execute permission to mvnw
RUN chmod +x mvnw

# Copy source code
COPY src src
COPY upload upload

# Create upload directory if it doesn't exist
RUN mkdir -p upload

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Set active profile to docker
ENV SPRING_PROFILES_ACTIVE=docker

# Run the application with the correct jar file name
ENTRYPOINT ["java", "-jar", "/app/target/Doctor_Reservation-0.0.1-SNAPSHOT.jar"]
# Base image
FROM ubuntu:22.04

# Maintainer
LABEL maintainer=""

# Environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y \
    awscli \
    curl \
    unzip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install AWS CDK globally
RUN npm install -g aws-cdk

# Set working directory
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads

# Copy files
# COPY . .

# Expose port
# EXPOSE 3000

# Run command
# CMD ["bash"]

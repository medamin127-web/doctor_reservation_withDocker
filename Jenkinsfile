pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE_BACKEND = 'mah127/doctor-reservation-backend'
        DOCKER_IMAGE_FRONTEND = 'mah127/doctor-reservation-frontend'
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE_BACKEND}:latest -f Dockerfile ."
                }
            }
        }
        
        stage('Build Frontend Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE_FRONTEND}:latest -f doctor-reservation-system/Dockerfile doctor-reservation-system/"
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    // Run Trivy scan and continue even if vulnerabilities are found
                    sh """
                        trivy image ${DOCKER_IMAGE_BACKEND}:latest --no-progress --severity HIGH,CRITICAL || true
                        trivy image ${DOCKER_IMAGE_FRONTEND}:latest --no-progress --severity HIGH,CRITICAL || true
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub
                    sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                    
                    // Push images
                    sh """
                        docker push ${DOCKER_IMAGE_BACKEND}:latest
                        docker push ${DOCKER_IMAGE_FRONTEND}:latest
                    """
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
    }
}
pipeline {
    agent any
    
    environment {
        // Updated with your Docker Hub username
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
                    // Install Trivy if not present
                    sh '''
                        if ! command -v trivy &> /dev/null; then
                            curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
                        fi
                    '''
                    
                    // Scan both images
                    sh """
                        trivy image ${DOCKER_IMAGE_BACKEND}:latest
                        trivy image ${DOCKER_IMAGE_FRONTEND}:latest
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub using credentials
                    sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                    
                    // Push both images
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
            // Logout from Docker Hub
            sh 'docker logout'
        }
    }
}
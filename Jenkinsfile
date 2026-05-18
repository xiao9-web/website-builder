pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
    disableConcurrentBuilds()
  }

  parameters {
    booleanParam(
      name: 'BUILD_DOCKER_IMAGES',
      defaultValue: false,
      description: 'Build backend and frontend Docker images after quality gates pass.'
    )
    booleanParam(
      name: 'RUN_COMPOSE_CONFIG_CHECK',
      defaultValue: true,
      description: 'Validate docker/docker-compose.full.yml when Docker Compose is available.'
    )
  }

  environment {
    APP_NAME = 'website-builder'
    SERVER_IMAGE = 'website-builder-server'
    WEB_IMAGE = 'website-builder-web'
    IMAGE_TAG = "${BUILD_NUMBER}"
    NEXT_PUBLIC_API_URL = 'http://localhost:8080/api'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git rev-parse --short HEAD'
      }
    }

    stage('Toolchain') {
      steps {
        sh '''
          set -eux
          java -version
          mvn -version
          node --version
          npm --version
        '''
      }
    }

    stage('Backend Unit Tests') {
      steps {
        sh 'mvn -f apps/server/pom.xml test'
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'apps/server/target/surefire-reports/*.xml'
        }
      }
    }

    stage('Backend Package') {
      steps {
        sh 'mvn -f apps/server/pom.xml -DskipTests package'
      }
      post {
        success {
          archiveArtifacts artifacts: 'apps/server/target/*.jar', fingerprint: true
        }
      }
    }

    stage('Frontend Install') {
      steps {
        dir('apps/web') {
          sh 'npm ci'
        }
      }
    }

    stage('Frontend Lint') {
      steps {
        dir('apps/web') {
          sh 'npm run lint'
        }
      }
    }

    stage('Frontend Build') {
      steps {
        dir('apps/web') {
          sh 'rm -rf .next && npm run build'
        }
      }
    }

    stage('Compose Config Check') {
      when {
        expression { return params.RUN_COMPOSE_CONFIG_CHECK }
      }
      steps {
        sh 'docker compose -f docker/docker-compose.full.yml config >/tmp/website-builder-compose.yml'
      }
    }

    stage('Docker Build') {
      when {
        expression { return params.BUILD_DOCKER_IMAGES }
      }
      steps {
        sh '''
          set -eux
          docker build -f apps/server/Dockerfile -t ${SERVER_IMAGE}:${IMAGE_TAG} -t ${SERVER_IMAGE}:latest .
          docker build -f apps/web/Dockerfile \
            --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
            -t ${WEB_IMAGE}:${IMAGE_TAG} \
            -t ${WEB_IMAGE}:latest .
        '''
      }
    }
  }

  post {
    success {
      echo "Website Builder CI passed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    }
    failure {
      echo "Website Builder CI failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    }
    always {
      sh 'rm -rf apps/web/.next/cache || true'
    }
  }
}

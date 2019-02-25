#!/usr/bin/env groovy

node  {

    stage('checkout') {
       checkout([$class: 'GitSCM',
            branches: [[name:  env.BRANCH_NAME]],
            doGenerateSubmoduleConfigurations: false,
            extensions: [],
            submoduleCfg: [],
            userRemoteConfigs: [[credentialsId: '0fb187ed-2823-4f81-b94f-0e59b3b553d7', url: 'http://gitlab.jbs.com.ua/icthothouse/xm-webapp.git']]
       ])
    }

    stage('build') {
        sh "rm -rf ./dist"
        sh "npm install --save-dev"
        sh "npm run prebuild"
        sh "npm run build-aot"
    }

    def dockerImage
    def dockerTag = env.BRANCH_NAME.replaceAll("/", "-")

    stage('build docker') {
        sh "rm -rf src/docker/dist"
        sh "cp -r ./dist src/docker/"
        dockerImage = docker.build('xmonline/xm-webapp:' + dockerTag, 'src/docker')
    }

    stage('push docker'){
        docker.withRegistry('https://index.docker.io/v1/', "${env.DOCKERHUB_AUTH}") {
            dockerImage.push(dockerTag)

            if ("${env.PUSH_LATEST}" == "true"){
                dockerImage.push('latest')
            }
        }
    }

    def needDeploy = true
    def docker_host = '/dev/null'
    def stack_name = 'xm2'
    def stack_env='none'
    stage ('init params'){
         switch("${env.ENV}"){
              case 'nodeploy':
                  needDeploy = false
                  break;
              case 'test':
                  docker_host='192.168.101.51'
                  stack_name='xm2test'
                  stack_env='test-env'
                  break;
              case 'prod':
                  docker_host='192.168.101.23'
                  stack_name='xm2prod'
                  stack_env='prod-env'
                  break;
              default:
                  exit 1;
         }
    }

    if (needDeploy) {
        stage('deploy') {
            sh "stack_env=${stack_env} docker-17 -H tcp://${docker_host}:2375 service update --image xmonline/xm-webapp:${dockerTag} ${stack_name}_web-app"
        }
    }

}

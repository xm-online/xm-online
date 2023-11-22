## Minikube

#### How to Run Locally

1. Install Minikube.
2. Run the following command to start Minikube with specified resources:
    ```
    minikube start --memory=8192MB --cpus=6
    ```
3. Start Skaffold development with:
    ```
    skaffold dev
    ```

### Samples

#### Using Local Configuration Directory

Follow these steps in the terminal:

1. Mount your configuration directory to Minikube:
    ```
    minikube mount <Your Config Directory>:/root/repository
    ```
2. In `config.deployment.yaml`, under `spec/template/spec/volumes`:
3. Remove the line `emptyDir: { }`
4. Set `hostPath: /root/repository`. For example:

```yaml
volumes:
  - name: config-volume
    hostPath: /root/repository
```

#### Building the Local Web App

Add the following to your `skaffold.yaml` file:

```yaml
build:
  artifacts:
    - image: xmonline/xm-webapp
      context: <YOUR src/docker path>
```

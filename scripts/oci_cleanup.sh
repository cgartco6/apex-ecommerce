#!/bin/bash
cd /opt/apex-ecommerce/terraform
terraform destroy -var="compartment_ocid=$(oci iam compartment list --name apex-digital --query "data[0].id" --raw-output)" -var="ssh_public_key=$(cat ~/.ssh/id_rsa_apex.pub)" -auto-approve
echo "All Oracle Cloud resources destroyed."

grunt
cd ../dist/Back-end/VirtualAssistant
sls deploy
echo  "DEPLOY RULES"
cd ../Rules
sls deploy
echo  "DEPLOY NOTIFICATIONS"
cd ../Notifications
sls deploy
echo  "DEPLOY USERS"
cd ../Users
sls deploy;
echo  "DEPLOY EVENTS (VAMessageListener)"
cd ../Events
sls deploy
echo  "DEPLOY CONVERSATIONS WEBHOOK"
cd ../ConversationWebhookService
sls deploy
echo  "DEPLOY CURIOSITY WEBHOOK"
cd ../CuriosityWebhookService
sls deploy
echo  "DEPLOY ADMINISTRATION WEBHOOK"
cd ../AdministrationWebhookService
sls deploy
echo  "DEPLOY API GATEWAY"
cd ../APIGateway
sls deploy

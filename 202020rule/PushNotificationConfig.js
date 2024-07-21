import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: true,
});

export const scheduleNotification = () => {
  PushNotification.localNotificationSchedule({
    message: "It's time for your eye exercise!", // Notification message
    date: new Date(Date.now() + 60 * 1000), // Schedule notification for 1 minute later
    repeatType: 'minute', // Repeat every minute
  });
};

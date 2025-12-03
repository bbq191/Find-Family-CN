package com.opengps.locationsharing

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.location.LocationManager
import android.os.IBinder
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay

class BackgroundLocationService : Service() {

    private val CHANNEL_ID = "Mock Location"
    private val NOTIFICATION_ID = 1
    private var serviceJob: Job? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, createNotification("Starting..."))
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startUpdatingNotification()
        return START_STICKY
    }

    @SuppressLint("MissingPermission")
    private fun startUpdatingNotification() {
        val locationManager = getSystemService(LocationManager::class.java)

        // 使用 GPS_PROVIDER 代替不存在的 FUSED_PROVIDER
        try {
            locationManager.requestLocationUpdates(
                LocationManager.GPS_PROVIDER,
                SHARE_INTERVAL,
                0F
            ) {}
        } catch (e: Exception) {
            android.util.Log.e("BackgroundLocationService", "无法请求位置更新", e)
            updateNotification("位置服务启动失败")
        }

        serviceJob = SuspendScope {
            try {
                while(platformInternal == null)
                    platformInternal = AndroidPlatform(this@BackgroundLocationService)
                //TODO: eventually re-enable tor
                //runtime.startDaemonAsync()
                Networking.init()
                updateNotification("started")
                var availability = true
                while(true) {
                    // 优先使用 GPS，如果不可用则使用 NETWORK
                    val location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                        ?: locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
                if(location != null) {
                    backgroundTask(
                        Coord(
                            location.latitude,
                            location.longitude
                        ),
                        location.speed
                    )
                    if(!availability) {
                        updateNotification("location available")
                        availability = true
                    }
                } else {
                    println("Location unavailable")
                    if(availability) {
                        updateNotification("location unavailable")
                        availability = false
                    }
                }
                delay(SHARE_INTERVAL)
            }
            } catch (e: Exception) {
                android.util.Log.e("BackgroundLocationService", "后台服务运行错误", e)
                updateNotification("服务错误: ${e.message}")
            }
        }
    }

    private fun createNotificationChannel() {
        val serviceChannel = NotificationChannel(
            CHANNEL_ID,
            "Location Sharing",
            NotificationManager.IMPORTANCE_NONE
        )
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(serviceChannel)
    }

    private fun createNotification(text: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Location Sharing")
            .setContentText(text)
            .setSmallIcon(R.drawable.baseline_notifications_24) // Replace with your icon
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .build()
    }

    private fun updateNotification(text: String) {
        val notification = createNotification(text)
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.notify(NOTIFICATION_ID, notification)
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceJob?.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}
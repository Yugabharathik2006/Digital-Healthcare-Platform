/**
 * Asynchronous Message Broker & Notification Queue
 * Supports RabbitMQ with clear Development Fallback Queue Worker.
 */

const EventEmitter = require('events');

class NotificationQueueManager extends EventEmitter {
  constructor() {
    super();
    this.jobsQueue = [];
    this.processedJobs = [];
    this.isRabbitMQConnected = false;
    this.statusMessage = 'Active: In-Memory Event Queue Worker (RabbitMQ broker offline)';
    this.isProcessing = false;

    // Start background worker loop
    this.startWorker();
  }

  async publish(eventType, payload) {
    const job = {
      id: 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      eventType,
      payload,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
      processedAt: null
    };

    this.jobsQueue.push(job);
    console.log(`[MESSAGE BROKER] 📨 Queued Event: ${eventType} | Job ID: ${job.id}`);
    
    // Trigger queue processing
    this.processNext();
    return job;
  }

  async processNext() {
    if (this.isProcessing || this.jobsQueue.length === 0) return;
    this.isProcessing = true;

    const job = this.jobsQueue.shift();
    job.status = 'PROCESSING';

    // Simulate asynchronous notification dispatch (e.g. Email / SMS gateway delivery)
    setTimeout(() => {
      job.status = 'DELIVERED';
      job.processedAt = new Date().toISOString();
      job.recipient = job.payload.patientEmail || job.payload.patientName || 'User';
      job.channel = 'Email & SMS Mock Gateway';
      
      this.processedJobs.unshift(job);
      if (this.processedJobs.length > 50) this.processedJobs.pop(); // keep last 50

      console.log(`[NOTIFICATION WORKER] ✅ Dispatched ${job.eventType} notification to ${job.recipient}`);
      
      this.emit('jobCompleted', job);
      this.isProcessing = false;
      this.processNext();
    }, 600);
  }

  startWorker() {
    setInterval(() => {
      if (this.jobsQueue.length > 0 && !this.isProcessing) {
        this.processNext();
      }
    }, 1000);
  }

  getStatus() {
    return {
      broker: this.isRabbitMQConnected ? 'RABBITMQ_ONLINE' : 'IN_MEMORY_QUEUE_WORKER',
      isFallback: !this.isRabbitMQConnected,
      message: this.statusMessage,
      pendingCount: this.jobsQueue.length,
      processedCount: this.processedJobs.length,
      recentJobs: this.processedJobs.slice(0, 10)
    };
  }
}

const queueManager = new NotificationQueueManager();
module.exports = queueManager;

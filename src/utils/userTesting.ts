```typescript
interface UserFeedback {
  userId: string;
  pageUrl: string;
  action: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

class UserTestingService {
  private feedbackQueue: UserFeedback[] = [];
  private isRecording = false;

  startRecording(): void {
    this.isRecording = true;
    this.attachEventListeners();
  }

  stopRecording(): void {
    this.isRecording = false;
    this.removeEventListeners();
    this.processFeedback();
  }

  private recordAction(action: string, metadata?: Record<string, any>): void {
    if (!this.isRecording) return;

    this.feedbackQueue.push({
      userId: 'test-user', // Replace with actual user ID
      pageUrl: window.location.href,
      action,
      timestamp: Date.now(),
      metadata
    });
  }

  private attachEventListeners(): void {
    document.addEventListener('click', this.handleClick);
    document.addEventListener('keypress', this.handleKeyPress);
    document.addEventListener('scroll', this.handleScroll);
  }

  private removeEventListeners(): void {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('keypress', this.handleKeyPress);
    document.removeEventListener('scroll', this.handleScroll);
  }

  private handleClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    this.recordAction('click', {
      elementType: target.tagName,
      elementId: target.id,
      elementText: target.textContent
    });
  };

  private handleKeyPress = (e: KeyboardEvent): void => {
    this.recordAction('keypress', {
      key: e.key,
      target: (e.target as HTMLElement).tagName
    });
  };

  private handleScroll = (): void => {
    this.recordAction('scroll', {
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight
    });
  };

  private async processFeedback(): Promise<void> {
    // Send feedback to analytics service
    try {
      await fetch('/api/user-testing/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.feedbackQueue)
      });
      this.feedbackQueue = [];
    } catch (error) {
      console.error('Failed to process feedback:', error);
    }
  }
}

export const userTesting = new UserTestingService();
```
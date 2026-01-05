import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

interface Activity {
  user: string;
  action: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: StatCard[] = [];
  recentActivities: Activity[] = [];
  currentUser = {
    name: 'Loading...',
    email: '',
    role: 'User',
    avatar: 'U'
  };
  
  isAdmin: boolean = false;
  showEmailModal: boolean = false;
  emailTemplates = [
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to SWMS - Your Account is Ready',
      body: `Dear [Employee Name],

Welcome to Smart Workforce Management System (SWMS)!

We are excited to have you join our team. Your account has been successfully created and you can now access the system.

Login Details:
- Email: [employee.email]
- Temporary Password: [temporary_password]

Please login and change your password immediately for security purposes.

If you have any questions, feel free to reach out to our support team.

Best regards,
SWMS Administration Team`
    },
    {
      id: 2,
      name: 'Task Assignment',
      subject: 'New Task Assigned - Action Required',
      body: `Dear [Employee Name],

A new task has been assigned to you in SWMS.

Task Details:
- Task Name: [Task Name]
- Priority: [High/Medium/Low]
- Due Date: [Due Date]
- Description: [Task Description]

Please review the task details and update the status accordingly.

You can access the task by logging into the SWMS portal.

Best regards,
Project Manager`
    },
    {
      id: 3,
      name: 'Meeting Reminder',
      subject: 'Meeting Reminder - [Meeting Topic]',
      body: `Dear [Employee Name],

This is a reminder for the upcoming meeting scheduled.

Meeting Details:
- Topic: [Meeting Topic]
- Date: [Meeting Date]
- Time: [Meeting Time]
- Location: [Meeting Location/Link]
- Agenda: [Meeting Agenda]

Please make sure to join on time and prepare any required materials.

Looking forward to your participation.

Best regards,
SWMS Team`
    },
    {
      id: 4,
      name: 'Performance Review',
      subject: 'Performance Review Notification',
      body: `Dear [Employee Name],

Your performance review for [Review Period] is now available in the SWMS portal.

Please login to review your evaluation and provide your feedback.

Review Summary:
- Review Period: [Review Period]
- Review Date: [Review Date]
- Reviewer: [Reviewer Name]

If you have any questions or concerns, please schedule a meeting with your manager.

Best regards,
HR Department`
    },
    {
      id: 5,
      name: 'Leave Approval',
      subject: 'Leave Request Status Update',
      body: `Dear [Employee Name],

Your leave request has been [Approved/Rejected].

Leave Details:
- Leave Type: [Leave Type]
- Start Date: [Start Date]
- End Date: [End Date]
- Duration: [Number of Days]
- Status: [Approved/Rejected]

[If Approved]
Your leave has been approved. Please ensure all pending work is completed or delegated before your leave starts.

[If Rejected]
Reason: [Rejection Reason]

For any questions, please contact HR.

Best regards,
HR Department`
    }
  ];
  selectedTemplate: any = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkUserRole();
    this.loadUserInfo();
    this.loadStats();
    this.loadActivities();
  }

  checkUserRole() {
    this.isAdmin = this.authService.isAdmin();
    const role = this.authService.getUserRole();
    if (role) {
      this.currentUser.role = role === 'admin' ? 'Administrator' : 'User';
    }
  }

  loadUserInfo() {
    // Get user email from storage
    const email = this.authService.getUserEmail();
    if (email) {
      this.currentUser.email = email;
      this.currentUser.name = email.split('@')[0];
      this.currentUser.avatar = email.substring(0, 2).toUpperCase();
    }

    // Fetch user info from protected endpoint
    this.authService.getUserInfo().subscribe({
      next: (response) => {
        console.log('User info:', response);
        if (response.username) {
          this.currentUser.email = response.username;
          this.currentUser.name = response.username.split('@')[0];
          this.currentUser.avatar = response.username.substring(0, 2).toUpperCase();
        }
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });

    // Fetch dashboard data
    this.authService.getDashboardData().subscribe({
      next: (response) => {
        console.log('Dashboard data:', response);
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      }
    });
  }

  loadStats() {
    if (this.isAdmin) {
      // Admin sees all company data
      this.stats = [
        {
          title: 'Total Employees',
          value: '1,234',
          change: '+12.5%',
          isPositive: true,
          icon: 'users'
        },
        {
          title: 'Active Projects',
          value: '48',
          change: '+8.2%',
          isPositive: true,
          icon: 'briefcase'
        },
        {
          title: 'Tasks Completed',
          value: '892',
          change: '+23.1%',
          isPositive: true,
          icon: 'check-circle'
        },
        {
          title: 'Pending Tasks',
          value: '156',
          change: '-5.3%',
          isPositive: false,
          icon: 'clock'
        }
      ];
    } else {
      // Normal user sees only their personal data
      this.stats = [
        {
          title: 'My Projects',
          value: '3',
          change: '+1',
          isPositive: true,
          icon: 'briefcase'
        },
        {
          title: 'My Tasks',
          value: '12',
          change: '+2',
          isPositive: true,
          icon: 'check-circle'
        },
        {
          title: 'Completed',
          value: '8',
          change: '+3',
          isPositive: true,
          icon: 'check-circle'
        },
        {
          title: 'Pending',
          value: '4',
          change: '-1',
          isPositive: false,
          icon: 'clock'
        }
      ];
    }
  }

  loadActivities() {
    if (this.isAdmin) {
      // Admin sees all company activities
      this.recentActivities = [
        {
          user: 'Sarah Johnson',
          action: 'completed task "Design Review"',
          time: '5 minutes ago',
          type: 'success'
        },
        {
          user: 'Mike Chen',
          action: 'added new employee "Alex Thompson"',
          time: '15 minutes ago',
          type: 'info'
        },
        {
          user: 'Emma Wilson',
          action: 'updated project status',
          time: '30 minutes ago',
          type: 'info'
        },
        {
          user: 'David Brown',
          action: 'reported an issue in "Mobile App"',
          time: '1 hour ago',
          type: 'warning'
        },
        {
          user: 'Lisa Anderson',
          action: 'completed task "Code Deployment"',
          time: '2 hours ago',
          type: 'success'
        }
      ];
    } else {
      // Normal user sees only their own activities
      const userName = this.currentUser.name || 'You';
      this.recentActivities = [
        {
          user: userName,
          action: 'completed task "Update Documentation"',
          time: '1 hour ago',
          type: 'success'
        },
        {
          user: userName,
          action: 'started working on "Frontend Development"',
          time: '3 hours ago',
          type: 'info'
        },
        {
          user: userName,
          action: 'commented on task "Bug Fix"',
          time: '5 hours ago',
          type: 'info'
        }
      ];
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
        // Router navigation is handled in the auth service
      },
      error: (err) => {
        console.error('Error during logout:', err);
        // Clear tokens anyway and redirect
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      }
    });
  }

  openEmailModal() {
    this.showEmailModal = true;
  }

  closeEmailModal() {
    this.showEmailModal = false;
    this.selectedTemplate = null;
  }

  selectTemplate(template: any) {
    this.selectedTemplate = { ...template };
  }

  copyTemplate() {
    if (this.selectedTemplate) {
      const emailContent = `Subject: ${this.selectedTemplate.subject}\n\n${this.selectedTemplate.body}`;
      navigator.clipboard.writeText(emailContent).then(() => {
        alert('Email template copied to clipboard!');
      });
    }
  }

  sendEmail() {
    if (this.selectedTemplate) {
      // Here you can integrate with your backend email service
      console.log('Sending email:', this.selectedTemplate);
      alert('Email functionality will be integrated with backend service!');
      this.closeEmailModal();
    }
  }
}

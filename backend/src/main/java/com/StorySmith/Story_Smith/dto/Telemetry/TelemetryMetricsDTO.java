package com.StorySmith.Story_Smith.dto.Telemetry;

public class TelemetryMetricsDTO {
    private long totalUsers;
    private long dailyActiveUsers;
    private long totalProjectsCreated;
    private long totalWikiPagesCreated;
    private long totalAiRequests;

    public TelemetryMetricsDTO() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getDailyActiveUsers() {
        return dailyActiveUsers;
    }

    public void setDailyActiveUsers(long dailyActiveUsers) {
        this.dailyActiveUsers = dailyActiveUsers;
    }

    public long getTotalProjectsCreated() {
        return totalProjectsCreated;
    }

    public void setTotalProjectsCreated(long totalProjectsCreated) {
        this.totalProjectsCreated = totalProjectsCreated;
    }

    public long getTotalWikiPagesCreated() {
        return totalWikiPagesCreated;
    }

    public void setTotalWikiPagesCreated(long totalWikiPagesCreated) {
        this.totalWikiPagesCreated = totalWikiPagesCreated;
    }

    public long getTotalAiRequests() {
        return totalAiRequests;
    }

    public void setTotalAiRequests(long totalAiRequests) {
        this.totalAiRequests = totalAiRequests;
    }
}

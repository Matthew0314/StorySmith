package com.StorySmith.Story_Smith.dto.WikiDTOs.WikiBlocks;
import java.util.List;
public class StatBlockDTO {
    private Integer maxValue;
    private List<StatItemDTO> stats;

    public StatBlockDTO() {
    }

    public StatBlockDTO(Integer maxValue, List<StatItemDTO> stats) {
        this.maxValue = maxValue;
        this.stats = stats;
    }

    public Integer getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(Integer maxValue) {
        this.maxValue = maxValue;
    }

    public List<StatItemDTO> getStats() {
        return stats;
    }

    public void setStats(List<StatItemDTO> stats) {
        this.stats = stats;
    }

}

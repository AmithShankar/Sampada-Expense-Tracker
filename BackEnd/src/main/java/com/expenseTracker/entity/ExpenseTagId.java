package com.expenseTracker.entity;

import java.io.Serializable;
import java.util.Objects;

public class ExpenseTagId implements Serializable {

    private String expenseId;
    private Long tagId;

    public ExpenseTagId() {}

    public ExpenseTagId(String expenseId, Long tagId) {
        this.expenseId = expenseId;
        this.tagId = tagId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ExpenseTagId)) return false;
        ExpenseTagId that = (ExpenseTagId) o;
        return Objects.equals(expenseId, that.expenseId) &&
               Objects.equals(tagId, that.tagId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(expenseId, tagId);
    }
}

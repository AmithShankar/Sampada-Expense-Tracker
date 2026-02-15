import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { CategoryColumn } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { budgetIcons } from "@/data/data";
import { useAuthStore } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
} from "@/components/api/api";
import { CategoriesFormData } from "@/types/categories";

const colorOptions = [
  "hsl(186, 72%, 30%)",
  "hsl(140, 69%, 40%)",
  "hsl(280, 65%, 55%)",
  "hsl(340, 75%, 55%)",
  "hsl(38, 92%, 50%)",
  "hsl(210, 89%, 48%)",
  "hsl(160, 60%, 45%)",
  "hsl(220, 70%, 50%)",
];

export default function Categories() {
  const [categories, setCategories] = useState<any>();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryColumn | null>(
    null,
  );
  const [formData, setFormData] = useState<CategoriesFormData>({
    name: "",
    icon: 0,
    color: colorOptions[0],
  });
  const currency = useAuthStore.getState().currency;
  const userId = useAuthStore.getState().userId;

  const { data } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getCategoriesApi(userId),
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  let ccy: string;

  switch (currency) {
    case "INR":
      ccy = "₹";
      break;
    case "USD":
      ccy = "$";
      break;
    case "EUR":
      ccy = "€";
      break;
    case "GBP":
      ccy = "£";
      break;
  }
  const queryClient = useQueryClient();

  const { mutate: updateOrDelete, isPending } = useMutation({
    mutationFn: editingCategory ? updateCategoryApi : addCategoryApi,
    onSuccess: (data) => {
      toast.success(
        editingCategory
          ? "Category updated successfully!"
          : "Category added successfully!",
      );
      setFormData({
        name: "",
        icon: 0,
        color: colorOptions[0],
      });
      queryClient.invalidateQueries({ queryKey: ["categories", userId] });
      setEditingCategory(null);
      setShowAddDialog(false);
    },
    onError: (error) => {
      toast.error(
        editingCategory
          ? "Error while updating category! "
          : "Error while adding category! " + error,
      );
    },
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const data = {
      id: formData.id,
      name: formData.name,
      categoryIcon: formData.icon,
      colorCode: formData.color,
      userid: userId,
    };

    updateOrDelete(data);

    setFormData({ name: "", icon: 0, color: colorOptions[0] });
  };

  const handleEdit = (category: CategoryColumn) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      icon: category.categoryIcon,
      color: category.colorCode,
    });
    setShowAddDialog(true);
  };

  const { mutate: deleteFunction, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: (data) => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories", userId] });
      queryClient.invalidateQueries({ queryKey: ["allExpenses", userId] });
    },
    onError: (error) => toast.error("Error while deleting category! " + error),
  });

  const handleDelete = (id: number) => {
    // setCategories(categories.filter((c) => c.id !== id));
    deleteFunction(id);
    toast.success("Category deleted");
  };

  return (
    <Layout>
      <Header
        title="Categories"
        subtitle="Organize your expenses with custom categories."
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 text-primary">
        {categories?.length != 0 && (
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {" "}
          {!categories || categories?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <div className="text-6xl mb-4 animate-bounce">📂</div>
              <p className="mb-4">No categories yet…</p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="gap-2 animate-pulse"
              >
                <Plus className="h-4 w-4" />
                Add your first category
              </Button>
            </div>
          ) : (
            categories?.map((category: any, index: number) => (
              <Card
                key={category.id}
                className={cn(
                  "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer",
                  "animate-slide-up opacity-0",
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundColor: category.colorCode }}
                />
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl transition-transform group-hover:scale-125"
                      style={{ backgroundColor: `${category.colorCode}20` }}
                    >
                      {budgetIcons[Number(category?.categoryIcon)]}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1 transition-colors group-hover:text-primary">
                    {category.name}
                  </h3>
                  {category.budget && (
                    <p className="text-sm text-muted-foreground">
                      Budget: {ccy}
                      {category.budget}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.colorCode }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {category.colorCode}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) {
            setEditingCategory(null);
            setFormData({
              name: "",
              icon: 0,
              color: colorOptions[0],
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] text-primary">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create New Category"}
            </DialogTitle>
            <DialogDescription>
              Customize your expense category with an icon and color.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Groceries"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-accent/30">
                {Object.entries(budgetIcons).map(([key, icon]) => {
                  const iconNumber = parseInt(key, 10);

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          icon: iconNumber,
                        }))
                      }
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all",
                        formData.icon === iconNumber
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-card hover:bg-accent",
                      )}
                    >
                      {icon}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color
              </Label>
              <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-accent/30">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={cn(
                      "h-8 w-8 rounded-full transition-all",
                      formData.color === color &&
                        "ring-2 ring-offset-2 ring-foreground scale-110",
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingCategory ? "Update" : "Create"} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

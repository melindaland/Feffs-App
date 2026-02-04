import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Survey, SurveyResponse } from "@/types";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SurveyFormProps {
  survey: Survey;
  onSubmit: (responses: SurveyResponse[]) => void;
  onCancel?: () => void;
}

export function SurveyForm({ survey, onSubmit, onCancel }: SurveyFormProps) {
  const colorScheme = useColorScheme();
  const [responses, setResponses] = useState<Record<string, string | number>>(
    {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTextChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: "" }));
  };

  const handleRatingChange = (questionId: string, value: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: "" }));
  };

  const handleMultipleChoiceChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    survey.questions.forEach((question) => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = "Cette question est obligatoire";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert(
        "Erreur",
        "Veuillez répondre à toutes les questions obligatoires",
      );
      return;
    }

    const surveyResponses: SurveyResponse[] = Object.entries(responses).map(
      ([questionId, answer]) => ({
        surveyId: survey.id,
        questionId,
        answer,
      }),
    );

    onSubmit(surveyResponses);
  };

  const renderQuestion = (question: (typeof survey.questions)[0]) => {
    switch (question.type) {
      case "text":
        return (
          <View style={styles.questionContainer} key={question.id}>
            <ThemedText style={styles.questionText}>
              {question.question}
              {question.required && (
                <ThemedText style={styles.required}> *</ThemedText>
              )}
            </ThemedText>
            <TextInput
              style={[
                styles.textInput,
                { color: Colors[colorScheme ?? "light"].text },
                {
                  borderColor: errors[question.id]
                    ? "#ef4444"
                    : Colors[colorScheme ?? "light"].icon + "40",
                },
              ]}
              placeholder="Votre réponse..."
              placeholderTextColor={Colors[colorScheme ?? "light"].icon}
              value={responses[question.id]?.toString() || ""}
              onChangeText={(text) => handleTextChange(question.id, text)}
              multiline
              numberOfLines={3}
              accessibilityLabel={`${question.question}${question.required ? ", champ obligatoire" : ""}`}
              accessibilityHint="Entrez votre réponse dans ce champ de texte"
            />
            {errors[question.id] && (
              <ThemedText style={styles.errorText}>
                {errors[question.id]}
              </ThemedText>
            )}
          </View>
        );

      case "rating":
        const min = question.min || 1;
        const max = question.max || 5;
        const selectedRating = responses[question.id] as number;

        return (
          <View style={styles.questionContainer} key={question.id}>
            <ThemedText style={styles.questionText}>
              {question.question}
              {question.required && (
                <ThemedText style={styles.required}> *</ThemedText>
              )}
            </ThemedText>
            <View style={styles.ratingContainer}>
              {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(
                (rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      selectedRating === rating && {
                        backgroundColor: Colors[colorScheme ?? "light"].tint,
                      },
                    ]}
                    onPress={() => handleRatingChange(question.id, rating)}
                    accessibilityRole="button"
                    accessibilityLabel={`Note ${rating} sur ${max}`}
                    accessibilityState={{ selected: selectedRating === rating }}
                    accessibilityHint="Appuyer pour sélectionner cette note"
                  >
                    <ThemedText
                      style={[
                        styles.ratingText,
                        selectedRating === rating && styles.ratingTextSelected,
                      ]}
                    >
                      {rating}
                    </ThemedText>
                  </TouchableOpacity>
                ),
              )}
            </View>
            {errors[question.id] && (
              <ThemedText style={styles.errorText}>
                {errors[question.id]}
              </ThemedText>
            )}
          </View>
        );

      case "multiple-choice":
        return (
          <View style={styles.questionContainer} key={question.id}>
            <ThemedText style={styles.questionText}>
              {question.question}
              {question.required && (
                <ThemedText style={styles.required}> *</ThemedText>
              )}
            </ThemedText>
            {question.options?.map((option) => {
              const isSelected = responses[question.id] === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    isSelected && {
                      backgroundColor:
                        Colors[colorScheme ?? "light"].tint + "20",
                      borderColor: Colors[colorScheme ?? "light"].tint,
                    },
                  ]}
                  onPress={() =>
                    handleMultipleChoiceChange(question.id, option)
                  }
                  accessibilityRole="radio"
                  accessibilityLabel={`Option: ${option}`}
                  accessibilityState={{ checked: isSelected }}
                  accessibilityHint={
                    isSelected
                      ? "Option sélectionnée"
                      : "Appuyer pour sélectionner cette option"
                  }
                >
                  <IconSymbol
                    name={isSelected ? "checkmark.circle.fill" : "circle"}
                    size={24}
                    color={
                      isSelected
                        ? Colors[colorScheme ?? "light"].tint
                        : Colors[colorScheme ?? "light"].icon
                    }
                  />
                  <ThemedText style={styles.optionText}>{option}</ThemedText>
                </TouchableOpacity>
              );
            })}
            {errors[question.id] && (
              <ThemedText style={styles.errorText}>
                {errors[question.id]}
              </ThemedText>
            )}
          </View>
        );

      case "yes-no":
        const yesNoValue = responses[question.id] as string;
        return (
          <View style={styles.questionContainer} key={question.id}>
            <ThemedText style={styles.questionText}>
              {question.question}
              {question.required && (
                <ThemedText style={styles.required}> *</ThemedText>
              )}
            </ThemedText>
            <View style={styles.yesNoContainer}>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  yesNoValue === "yes" && {
                    backgroundColor: Colors[colorScheme ?? "light"].tint,
                  },
                ]}
                onPress={() => handleMultipleChoiceChange(question.id, "yes")}
                accessibilityRole="button"
              >
                <ThemedText
                  style={[
                    styles.yesNoText,
                    yesNoValue === "yes" && styles.yesNoTextSelected,
                  ]}
                >
                  Oui
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesNoButton,
                  yesNoValue === "no" && {
                    backgroundColor: Colors[colorScheme ?? "light"].tint,
                  },
                ]}
                onPress={() => handleMultipleChoiceChange(question.id, "no")}
                accessibilityRole="button"
              >
                <ThemedText
                  style={[
                    styles.yesNoText,
                    yesNoValue === "no" && styles.yesNoTextSelected,
                  ]}
                >
                  Non
                </ThemedText>
              </TouchableOpacity>
            </View>
            {errors[question.id] && (
              <ThemedText style={styles.errorText}>
                {errors[question.id]}
              </ThemedText>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <IconSymbol
            name="doc.text.fill"
            size={40}
            color={Colors[colorScheme ?? "light"].tint}
          />
          <ThemedText type="title" style={styles.title}>
            {survey.title}
          </ThemedText>
          {survey.description && (
            <ThemedText style={styles.description}>
              {survey.description}
            </ThemedText>
          )}
        </ThemedView>

        {/* Questions */}
        <ThemedView style={styles.questionsContainer}>
          {survey.questions.map((question) => renderQuestion(question))}
        </ThemedView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: Colors[colorScheme ?? "light"].tint },
            ]}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Soumettre l'enquête"
          >
            <IconSymbol name="checkmark.circle.fill" size={24} color="#fff" />
            <ThemedText style={styles.submitButtonText}>Soumettre</ThemedText>
          </TouchableOpacity>

          {onCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Annuler"
            >
              <ThemedText style={styles.cancelButtonText}>Annuler</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 12,
  },
  title: {
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
  questionsContainer: {
    gap: 24,
  },
  questionContainer: {
    gap: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  required: {
    color: "#ef4444",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  ratingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(128, 128, 128, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
  },
  ratingTextSelected: {
    color: "#fff",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(128, 128, 128, 0.2)",
    gap: 12,
  },
  optionText: {
    fontSize: 15,
    flex: 1,
  },
  yesNoContainer: {
    flexDirection: "row",
    gap: 12,
  },
  yesNoButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(128, 128, 128, 0.3)",
    alignItems: "center",
  },
  yesNoText: {
    fontSize: 16,
    fontWeight: "600",
  },
  yesNoTextSelected: {
    color: "#fff",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
  },
  actions: {
    gap: 12,
    paddingTop: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 14,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  cancelButton: {
    padding: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    opacity: 0.7,
  },
});

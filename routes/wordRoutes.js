const express = require("express");
const Word = require("../models/Word");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { topic, learned } = req.query;
    const filter = {};

    if (topic && topic.trim()) {
      filter.topic = topic.trim();
    }

    if (typeof learned !== "undefined") {
      filter.isLearned = learned === "true";
    }

    const words = await Word.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(words);
  } catch (error) {
    return res.status(500).json({ message: "단어 조회 실패", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { koreanMeaning, foreignMeaning, topic, isLearned } = req.body;

    if (!koreanMeaning || !koreanMeaning.trim()) {
      return res.status(400).json({ message: "한글 뜻을 입력해주세요." });
    }
    if (!foreignMeaning || !foreignMeaning.trim()) {
      return res.status(400).json({ message: "외국어 뜻을 입력해주세요." });
    }
    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: "주제를 입력해주세요." });
    }

    const word = await Word.create({
      koreanMeaning: koreanMeaning.trim(),
      foreignMeaning: foreignMeaning.trim(),
      topic: topic.trim(),
      isLearned: Boolean(isLearned),
    });
    return res.status(201).json(word);
  } catch (error) {
    return res.status(500).json({ message: "단어 저장 실패", error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { koreanMeaning, foreignMeaning, topic, isLearned } = req.body;
    const updateData = {};

    if (typeof koreanMeaning !== "undefined") {
      if (!koreanMeaning || !koreanMeaning.trim()) {
        return res.status(400).json({ message: "한글 뜻을 입력해주세요." });
      }
      updateData.koreanMeaning = koreanMeaning.trim();
    }

    if (typeof foreignMeaning !== "undefined") {
      if (!foreignMeaning || !foreignMeaning.trim()) {
        return res.status(400).json({ message: "외국어 뜻을 입력해주세요." });
      }
      updateData.foreignMeaning = foreignMeaning.trim();
    }

    if (typeof topic !== "undefined") {
      if (!topic || !topic.trim()) {
        return res.status(400).json({ message: "주제를 입력해주세요." });
      }
      updateData.topic = topic.trim();
    }

    if (typeof isLearned !== "undefined") {
      updateData.isLearned = Boolean(isLearned);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "수정할 항목이 없습니다." });
    }

    const updatedWord = await Word.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedWord) {
      return res.status(404).json({ message: "해당 단어를 찾을 수 없습니다." });
    }

    return res.status(200).json(updatedWord);
  } catch (error) {
    return res.status(500).json({ message: "단어 수정 실패", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWord = await Word.findByIdAndDelete(id);

    if (!deletedWord) {
      return res.status(404).json({ message: "해당 단어를 찾을 수 없습니다." });
    }

    return res.status(200).json({ message: "단어가 삭제되었습니다." });
  } catch (error) {
    return res.status(500).json({ message: "단어 삭제 실패", error: error.message });
  }
});

module.exports = router;

package com.yaj.freedomen.config;

public interface SystemData { 
	//示例用户id，里面的项目都会变成示例
	public static final Integer expUserId = 1;
	//游客ID
	public static final Integer guestUserId = -9999; 
	//final
	public static final String plugSelect = "${plug}.plugId,${plug}.plugSameId,${plug}.plugTname,${plug}.userId,${plug}.plugName,${plug}.plugTooltip,${plug}.plugTags,${plug}.plugDes,${plug}.plugVersion,${plug}.plugStarCount,${plug}.plugCommentCount,${plug}.plugFavCount,${plug}.plugStatus,${plug}.plugType,${plug}.createdAt";
}
